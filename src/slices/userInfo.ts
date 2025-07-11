import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserInfo {
    user_code: number;
    user_name: string;
    user_nickname: string;
    user_hire_date: string;
    user_position: string;
}

interface InitialState {
    userDetail: UserInfo | null;
}

const initialState: InitialState = {
    userDetail: null,
};

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        getUserInformation(state, action: PayloadAction<UserInfo>) {
            state.userDetail = action.payload;
        },
    },
});

export default userInfoSlice;
