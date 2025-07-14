import { combineReducers } from 'redux';

import userSlice from '../slices/user';
import timeSlice from '../slices/time';
import attendanceSlice from '../slices/attendance';
import userInfoSlice from '../slices/userInfo';
import vacationSlice from '../slices/vacation';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  time: timeSlice.reducer,
  attendance: attendanceSlice.reducer,
  userInfo: userInfoSlice.reducer,
  vacation: vacationSlice.reducer,

});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;