import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    id: null,
    role: null, // 'teacher' | 'student'
    hasAnswered: false,
    answeredOptionId: null,
    isConnected: false,
    error: null,
    answerHistory: [], // Track all answers given
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.role = action.payload.role;
            state.isConnected = true;
            state.error = null;
        },
        setHasAnswered: (state, action) => {
            state.hasAnswered = action.payload;
        },
        setAnsweredOptionId: (state, action) => {
            state.answeredOptionId = action.payload;
            if (action.payload !== null) {
                state.answerHistory.push({
                    optionId: action.payload,
                    timestamp: Date.now()
                });
            }
        },
        resetAnswerState: (state) => {
            state.hasAnswered = false;
            state.answeredOptionId = null;
        },
        setConnected: (state, action) => {
            state.isConnected = action.payload;
        },
        setUserError: (state, action) => {
            state.error = action.payload;
        },
        clearUser: (state) => {
            return initialState;
        }
    },
});

export const { 
    setUser, 
    setHasAnswered, 
    setAnsweredOptionId,
    resetAnswerState,
    setConnected,
    setUserError,
    clearUser
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user;
export const selectUserName = (state) => state.user.name;
export const selectUserRole = (state) => state.user.role;
export const selectHasAnswered = (state) => state.user.hasAnswered;
export const selectIsConnected = (state) => state.user.isConnected;
export const selectAnswerHistory = (state) => state.user.answerHistory;

export default userSlice.reducer;
