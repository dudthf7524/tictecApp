import { combineReducers } from 'redux';

import userSlice from '../slices/user';
import timeSlice from '../slices/time';
import attendanceSlice from '../slices/attendance';
import userInfoSlice from '../slices/userInfo';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  time: timeSlice.reducer,
  attendance: attendanceSlice.reducer,
  userInfo: userInfoSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;