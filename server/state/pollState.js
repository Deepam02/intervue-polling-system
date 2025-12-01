// In-memory state management
// In production, use Redis or PostgreSQL for persistence

class PollState {
    constructor() {
        this.currentPoll = null;
        // Structure:
        // { 
        //   id, 
        //   questions: [{ text, options: [{id, text, votes}], correctOptionId, duration }], 
        //   currentQuestionIndex: 0,
        //   createdAt, 
        //   status: 'active' | 'ended' | 'waiting' 
        // }
        this.students = {}; // { socketId: { name, id, joinedAt } }
        this.answers = []; // { pollId, questionIndex, studentId, optionId, timestamp }
        this.pollHistory = []; // Array of completed polls
    }

    // Poll Management
    getPoll() {
        return this.currentPoll;
    }

    setPoll(poll) {
        if (this.currentPoll) {
            this._archivePoll();
        }
        this.currentPoll = poll;
        this.answers = []; // Reset answers for new poll
        return this.currentPoll;
    }

    clearPoll() {
        if (this.currentPoll) {
            this._archivePoll();
        }
        this.currentPoll = null;
        this.answers = [];
    }

    _archivePoll() {
        if (!this.currentPoll) return;
        
        const archived = {
            ...this.currentPoll,
            answers: this.answers.filter(a => a.pollId === this.currentPoll.id),
            completedAt: Date.now()
        };
        this.pollHistory.push(archived);
        
        // Keep only last 10 polls in memory
        if (this.pollHistory.length > 10) {
            this.pollHistory.shift();
        }
    }

    // Student Management
    addStudent(socketId, name) {
        const nameExists = Object.values(this.students).some(
            s => s.name.toLowerCase() === name.toLowerCase()
        );
        
        if (nameExists) {
            return { error: 'Name already taken' };
        }

        this.students[socketId] = { 
            name, 
            id: socketId,
            joinedAt: Date.now()
        };
        return { student: this.students[socketId] };
    }

    removeStudent(socketId) {
        delete this.students[socketId];
    }

    getStudent(socketId) {
        return this.students[socketId];
    }

    // Answer Management
    addAnswer(studentId, optionId) {
        if (!this.currentPoll || this.currentPoll.status !== 'active') {
            return { error: 'No active poll' };
        }

        const currentQIndex = this.currentPoll.currentQuestionIndex;

        const hasAnswered = this.answers.some(a =>
            a.pollId === this.currentPoll.id &&
            a.studentId === studentId &&
            a.questionIndex === currentQIndex
        );

        if (hasAnswered) {
            return { error: 'Already answered' };
        }

        this.answers.push({ 
            pollId: this.currentPoll.id, 
            questionIndex: currentQIndex, 
            studentId, 
            optionId,
            timestamp: Date.now()
        });

        // Update vote count
        const currentQuestion = this.currentPoll.questions[currentQIndex];
        const option = currentQuestion.options.find(o => o.id === optionId);
        if (option) {
            option.votes = (option.votes || 0) + 1;
        }

        return { success: true };
    }

    getAllStudentsAnswered() {
        if (!this.currentPoll) return false;
        
        const currentQIndex = this.currentPoll.currentQuestionIndex;
        const connectedStudentCount = Object.keys(this.students).length;
        const answeredCount = this.answers.filter(a => 
            a.pollId === this.currentPoll.id && 
            a.questionIndex === currentQIndex
        ).length;
        
        return connectedStudentCount > 0 && answeredCount === connectedStudentCount;
    }

    getStudentsList() {
        if (!this.currentPoll) return [];
        
        const currentQIndex = this.currentPoll.currentQuestionIndex;
        return Object.values(this.students).map(student => {
            const hasAnswered = this.answers.some(a =>
                a.pollId === this.currentPoll.id &&
                a.studentId === student.id &&
                a.questionIndex === currentQIndex
            );
            return {
                id: student.id,
                name: student.name,
                hasAnswered
            };
        });
    }

    getResults() {
        if (!this.currentPoll) return null;
        
        const currentQIndex = this.currentPoll.currentQuestionIndex;
        const currentQuestion = this.currentPoll.questions[currentQIndex];

        return {
            question: currentQuestion.text,
            options: currentQuestion.options,
            correctOptionId: currentQuestion.correctOptionId,
            totalVotes: this.answers.filter(a => 
                a.pollId === this.currentPoll.id && 
                a.questionIndex === currentQIndex
            ).length,
            currentQuestionIndex: currentQIndex,
            totalQuestions: this.currentPoll.questions.length
        };
    }

    getPollHistory() {
        return this.pollHistory;
    }
}

// Create singleton instance
const pollState = new PollState();

module.exports = {
    currentPoll: null,
    students: {},
    answers: [],
    pollHistory: [],
    // Expose class methods
    getPoll: () => pollState.getPoll(),
    setPoll: (poll) => pollState.setPoll(poll),
    clearPoll: () => pollState.clearPoll(),
    addStudent: (socketId, name) => pollState.addStudent(socketId, name),
    removeStudent: (socketId) => pollState.removeStudent(socketId),
    getStudent: (socketId) => pollState.getStudent(socketId),
    addAnswer: (studentId, optionId) => pollState.addAnswer(studentId, optionId),
    getAllStudentsAnswered: () => pollState.getAllStudentsAnswered(),
    getStudentsList: () => pollState.getStudentsList(),
    getResults: () => pollState.getResults(),
    getPollHistory: () => pollState.getPollHistory()
};
