import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    poll: null, // { id, question, options, duration, status, createdAt }
    results: null, // { question, options, totalVotes }
    timeLeft: 0,
    students: [], // List of connected students
};

const pollSlice = createSlice({
    name: 'poll',
    initialState,
    reducers: {
        setPoll: (state, action) => {
            state.poll = action.payload;
            state.results = null; // Reset results when new poll starts
        },
        updateResults: (state, action) => {
            state.results = action.payload;
        },
        setTimeLeft: (state, action) => {
            state.timeLeft = action.payload;
        },
        endPoll: (state) => {
            if (state.poll) state.poll.status = 'ended';
        },
        clearPoll: (state) => {
            state.poll = null;
            state.results = null;
            state.timeLeft = 0;
        },
        setStudents: (state, action) => {
            state.students = action.payload;
        }
    },
});

export const { setPoll, updateResults, setTimeLeft, endPoll, clearPoll, setStudents } = pollSlice.actions;
export default pollSlice.reducer;
