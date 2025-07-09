import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Attendance {
  attendance_id: number;
  user_code: number;
  start_time: string;
  end_time: string;
  rest_start_time: string;
  rest_end_time: string;
  attendance_start_date: string;
  attendance_start_time: string;
  attendance_start_state: string;
  attendance_end_date: string;
  attendance_end_time: string;
  attendance_end_state: string;
}

interface InitialState {
  attendanceToday: Attendance | null;
}

const initialState: InitialState = {
  attendanceToday: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    getAttendanceToday(state, action: PayloadAction<Attendance>) {
      state.attendanceToday = action.payload;
    },
  },
});

export const { getAttendanceToday } = attendanceSlice.actions;
export default attendanceSlice;
