import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Time {
  time_id: number;
  user_code: number;
  start_time: string;
  end_time: string;
  rest_start_time: string;
  rest_end_time: string;
}

interface InitialState {
  timeDetail: Time | null;
}

const initialState: InitialState = {
  timeDetail: null,
};

const timeSlice = createSlice({
  name: 'time',
  initialState,
  reducers: {
    getTime(state, action: PayloadAction<Time>) {
      state.timeDetail = action.payload;
    },
  },
});

export default timeSlice;
