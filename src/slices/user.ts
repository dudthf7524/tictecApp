import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// action : state로 바꾸는 행위/동작
// dispatch : 그 액션을 실제로 실행하는 함수
// reducer : 액션이 실제로 실행되면 state를 바꾸는 로직 

const initialState = {
    user_code: '',
    user_name: '',
    accessToken: '', 
};
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user_code = action.payload.user_code;
            state.user_name = action.payload.user_name;
            state.accessToken = action.payload.accessToken;
        },
        setAccessToken(state, action) {
            state.accessToken = action.payload
        },
    },

    extraReducers: builder => { },
});

export default userSlice;