const {
    getPoll, setPoll, addStudent, removeStudent, addAnswer, getResults, getStudent, students, getAllStudentsAnswered, getStudentsList
} = require('../state/pollState');

let currentTimer = null;

const startQuestionTimer = (io) => {
    const poll = getPoll();
    if (!poll) return;

    const currentQ = poll.questions[poll.currentQuestionIndex];
    let timeLeft = currentQ.duration;

    poll.status = 'active';

    // Broadcast new question state
    const publicPoll = {
        id: poll.id,
        question: currentQ.text,
        options: currentQ.options,
        duration: currentQ.duration,
        currentQuestionIndex: poll.currentQuestionIndex,
        totalQuestions: poll.questions.length,
        status: 'active',
        createdAt: Date.now()
    };

    io.emit('poll_update', publicPoll);

    if (currentTimer) clearInterval(currentTimer);

    currentTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(currentTimer);
            if (getPoll() && getPoll().id === poll.id) {
                // Timer ended
                if (poll.currentQuestionIndex >= poll.questions.length - 1) {
                    poll.status = 'ended';
                    io.emit('poll_ended', getResults());
                } else {
                    poll.status = 'waiting';
                    // Reuse poll_ended to show results, but client will see it's not the last question
                    // or we can send a specific event. Let's use poll_ended for now as it triggers result view.
                    io.emit('poll_ended', getResults());
                }
            }
        }
    }, 1000);
};

module.exports = (io, socket) => {
    // Student joins
    socket.on('join_session', ({ name }, callback) => {
        const result = addStudent(socket.id, name);
        if (result.error) {
            callback({ error: result.error });
        } else {
            callback({ success: true, student: result.student });
            // Broadcast updated students list to all clients
            io.emit('students_update', getStudentsList());
            // Send current poll state if any
            const poll = getPoll();
            if (poll) {
                const currentQ = poll.questions[poll.currentQuestionIndex];
                const publicPoll = {
                    id: poll.id,
                    question: currentQ.text,
                    options: currentQ.options,
                    duration: currentQ.duration,
                    currentQuestionIndex: poll.currentQuestionIndex,
                    totalQuestions: poll.questions.length,
                    status: poll.status,
                    createdAt: poll.createdAt // Note: this might need adjustment for accurate timer sync on rejoin
                };

                // Hide correct answer if active
                if (poll.status === 'active') {
                    publicPoll.correctOptionId = undefined;
                    socket.emit('poll_update', publicPoll);
                } else {
                    // If ended or waiting, send results
                    socket.emit('poll_results', getResults());
                }
            }
        }
    });

    // Teacher creates poll (now accepts array of questions)
    socket.on('create_poll', ({ questions }, callback) => {
        // Check if there's already an active poll
        const existingPoll = getPoll();
        if (existingPoll && existingPoll.status === 'active') {
            return callback({ error: 'A poll is already active. Please wait for it to complete.' });
        }

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return callback({ error: 'Invalid questions data' });
        }

        const poll = {
            id: Date.now().toString(),
            questions: questions.map((q) => ({
                text: q.question, // Client sends { question: "...", options: [...], ... }
                options: q.options.map((opt, idx) => ({ id: idx, text: opt.text || opt, votes: 0 })),
                correctOptionId: q.correctOptionId,
                duration: q.duration || 60
            })),
            currentQuestionIndex: 0,
            createdAt: Date.now(),
            status: 'active'
        };

        setPoll(poll);
        startQuestionTimer(io);
        callback({ success: true });
    });

    // Teacher starts next question
    socket.on('next_question', ({ }, callback) => {
        const poll = getPoll();
        if (!poll || poll.status !== 'waiting') {
            return callback({ error: 'Cannot start next question' });
        }

        // Check if all students have answered
        const allAnswered = getAllStudentsAnswered();
        if (!allAnswered) {
            return callback({ error: 'Not all students have answered yet' });
        }

        if (poll.currentQuestionIndex < poll.questions.length - 1) {
            poll.currentQuestionIndex++;
            startQuestionTimer(io);
            callback({ success: true });
        } else {
            callback({ error: 'No more questions' });
        }
    });

    // Student submits answer
    socket.on('submit_answer', ({ optionId }, callback) => {
        const student = getStudent(socket.id);
        if (!student) return callback({ error: 'Not authenticated' });

        const result = addAnswer(student.id, optionId);
        if (result.error) {
            callback({ error: result.error });
        } else {
            callback({ success: true });
            io.emit('poll_update_stats', getResults());
            io.emit('students_update', getStudentsList());
        }
    });

    // Teacher removes student
    socket.on('remove_student', ({ studentId }, callback) => {
        removeStudent(studentId);
        io.to(studentId).emit('kicked');
        io.emit('students_update', getStudentsList());
        callback({ success: true });
    });

    // Get students list
    socket.on('get_students', (callback) => {
        callback({ students: getStudentsList() });
    });

    socket.on('disconnect', () => {
        removeStudent(socket.id);
        io.emit('students_update', getStudentsList());
    });
};
