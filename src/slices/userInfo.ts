import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserInfo {
    user_code: number;
    user_name: string;
    user_nickname: string;
    user_position: string;
    user_hire_date: string;
    country_name: string;
    department_name: string;
    education_level_name: string;
    user_birth_date: string;
    user_annual_leave: string;
    user_blood_type: string;
    user_phone: string;
    user_postcode: string;
    user_address_basic: string;
    user_address_detail: string;
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
