import { combineReducers } from 'redux';

import userSlice from '../slices/user';
import timeSlice from '../slices/time';
import attendanceSlice from '../slices/attendance';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  time: timeSlice.reducer,
  attendance: attendanceSlice.reducer,

});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;