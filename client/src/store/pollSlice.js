import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    poll: null, // { id, question, options, duration, status, createdAt }
    results: null, // { question, options, totalVotes }
    timeLeft: 0,
    students: [], // List of connected students
    isLoading: false,
    error: null,
    pollHistory: [], // Previous polls for reference
};

const pollSlice = createSlice({
    name: 'poll',
    initialState,
    reducers: {
        setPoll: (state, action) => {
            state.poll = action.payload;
            state.results = null; // Reset results when new poll starts
            state.error = null;
            state.isLoading = false;
        },
        updateResults: (state, action) => {
            state.results = action.payload;
        },
        setTimeLeft: (state, action) => {
            state.timeLeft = action.payload;
        },
        endPoll: (state) => {
            if (state.poll) {
                state.poll.status = 'ended';
                // Archive current poll
                if (state.poll && !state.pollHistory.find(p => p.id === state.poll.id)) {
                    state.pollHistory.push({
                        ...state.poll,
                        results: state.results,
                        endedAt: Date.now()
                    });
                }
            }
        },
        clearPoll: (state) => {
            if (state.poll && !state.pollHistory.find(p => p.id === state.poll.id)) {
                state.pollHistory.push({
                    ...state.poll,
                    results: state.results,
                    endedAt: Date.now()
                });
            }
            state.poll = null;
            state.results = null;
            state.timeLeft = 0;
            state.error = null;
        },
        setStudents: (state, action) => {
            state.students = action.payload || [];
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        updatePollStatus: (state, action) => {
            if (state.poll) {
                state.poll.status = action.payload;
            }
        },
        resetError: (state) => {
            state.error = null;
        }
    },
});

export const { 
    setPoll, 
    updateResults, 
    setTimeLeft, 
    endPoll, 
    clearPoll, 
    setStudents,
    setLoading,
    setError,
    updatePollStatus,
    resetError
} = pollSlice.actions;

// Selectors
export const selectPoll = (state) => state.poll.poll;
export const selectResults = (state) => state.poll.results;
export const selectStudents = (state) => state.poll.students;
export const selectTimeLeft = (state) => state.poll.timeLeft;
export const selectIsLoading = (state) => state.poll.isLoading;
export const selectError = (state) => state.poll.error;
export const selectPollHistory = (state) => state.poll.pollHistory;

export default pollSlice.reducer;
