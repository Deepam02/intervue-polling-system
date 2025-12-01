// In-memory state
// In a real app, this would be in a database (Redis/Postgres)

let currentPoll = null;
// Structure:
// { 
//   id, 
//   questions: [{ text, options: [{id, text, votes}], correctOptionId, duration }], 
//   currentQuestionIndex: 0,
//   createdAt, 
//   status: 'active' | 'ended' | 'waiting' 
// }

let students = {}; // { socketId: { name, id } }
let answers = []; // { pollId, questionIndex, studentId, optionId }
let pollHistory = []; // Array of past polls

module.exports = {
    currentPoll,
    students,
    answers,
    pollHistory,
    // Getters and Setters to manage state
    getPoll: () => currentPoll,
    setPoll: (poll) => {
        if (currentPoll) {
            pollHistory.push({ ...currentPoll, answers: [...answers.filter(a => a.pollId === currentPoll.id)] });
        }
        currentPoll = poll;
        answers = []; // Reset answers for new poll
    },
    clearPoll: () => {
        if (currentPoll) {
            pollHistory.push({ ...currentPoll, answers: [...answers.filter(a => a.pollId === currentPoll.id)] });
        }
        currentPoll = null;
        answers = [];
    },

    addStudent: (socketId, name) => {
        // Check uniqueness
        const nameExists = Object.values(students).some(s => s.name.toLowerCase() === name.toLowerCase());
        if (nameExists) return { error: 'Name already taken' };

        students[socketId] = { name, id: socketId };
        return { student: students[socketId] };
    },

    removeStudent: (socketId) => {
        delete students[socketId];
    },

    getStudent: (socketId) => students[socketId],

    addAnswer: (studentId, optionId) => {
        if (!currentPoll || currentPoll.status !== 'active') return { error: 'No active poll' };

        const currentQIndex = currentPoll.currentQuestionIndex;

        const hasAnswered = answers.some(a =>
            a.pollId === currentPoll.id &&
            a.studentId === studentId &&
            a.questionIndex === currentQIndex
        );

        if (hasAnswered) return { error: 'Already answered' };

        answers.push({ pollId: currentPoll.id, questionIndex: currentQIndex, studentId, optionId });

        // Update vote count in currentPoll for easier frontend consumption
        const currentQuestion = currentPoll.questions[currentQIndex];
        const option = currentQuestion.options.find(o => o.id === optionId);
        if (option) {
            option.votes = (option.votes || 0) + 1;
        }

        return { success: true };
    },

    getAllStudentsAnswered: () => {
        if (!currentPoll) return false;
        const currentQIndex = currentPoll.currentQuestionIndex;
        const connectedStudentCount = Object.keys(students).length;
        const answeredCount = answers.filter(a => 
            a.pollId === currentPoll.id && 
            a.questionIndex === currentQIndex
        ).length;
        return connectedStudentCount > 0 && answeredCount === connectedStudentCount;
    },

    getStudentsList: () => {
        if (!currentPoll) return [];
        const currentQIndex = currentPoll.currentQuestionIndex;
        return Object.values(students).map(student => {
            const hasAnswered = answers.some(a =>
                a.pollId === currentPoll.id &&
                a.studentId === student.id &&
                a.questionIndex === currentQIndex
            );
            return {
                id: student.id,
                name: student.name,
                hasAnswered
            };
        });
    },

    getResults: () => {
        if (!currentPoll) return null;
        const currentQIndex = currentPoll.currentQuestionIndex;
        const currentQuestion = currentPoll.questions[currentQIndex];

        return {
            question: currentQuestion.text,
            options: currentQuestion.options,
            correctOptionId: currentQuestion.correctOptionId,
            totalVotes: answers.filter(a => a.pollId === currentPoll.id && a.questionIndex === currentQIndex).length,
            currentQuestionIndex: currentQIndex,
            totalQuestions: currentPoll.questions.length
        };
    }
};
