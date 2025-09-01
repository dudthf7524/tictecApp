import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkPlace {
  work_place_id: number;
  company_code: number;
  location_latitude: number;
  location_hardness: number;
  address: string;
  radius: number;
}

interface InitialState {
  workPlaceDetail: WorkPlace | null;
  isWithinRadius: boolean;
}

const initialState: InitialState = {
  workPlaceDetail: null,
  isWithinRadius: false,
};

const workPlaceSlice = createSlice({
  name: 'workPlace',
  initialState,
  reducers: {
    getworkPlace(state, action: PayloadAction<WorkPlace>) {
      state.workPlaceDetail = action.payload;
    },
    setIsWithinRadius(state, action: PayloadAction<boolean>) {
      state.isWithinRadius = action.payload;
    },
  },
});

export default workPlaceSlice;