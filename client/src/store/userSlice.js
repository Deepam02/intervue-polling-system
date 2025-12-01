import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    id: null,
    role: null, // 'teacher' | 'student'
    hasAnswered: false,
    answeredOptionId: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.role = action.payload.role;
        },
        setHasAnswered: (state, action) => {
            state.hasAnswered = action.payload;
        },
        setAnsweredOptionId: (state, action) => {
            state.answeredOptionId = action.payload;
        },
    },
});

export const { setUser, setHasAnswered, setAnsweredOptionId } = userSlice.actions;
export default userSlice.reducer;
