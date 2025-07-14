import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Vacation {
  vacation_id: number;
  user_code: number;
  start_date: string;
  end_date: string;
  reason: string;
  vacation_state: number;
}

interface InitialState {
  vacationList: Vacation | [];
}

const initialState: InitialState = {
    vacationList: [],
};

const vacationSlice = createSlice({
  name: 'vacation',
  initialState,
  reducers: {
    getVacation(state, action: PayloadAction<Vacation>) {
      state.vacationList = action.payload;
    },
  },
});

export default vacationSlice;