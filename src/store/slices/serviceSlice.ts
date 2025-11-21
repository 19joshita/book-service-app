import { createSlice } from "@reduxjs/toolkit";
import { Service } from "../../types/service";
import { SERVICES } from "../../constants/dummyData";

interface ServicesState {
  list: Service[];
}

const initialState: ServicesState = {
  list: SERVICES,
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setServices(state, action: { payload: Service[] }) {
      state.list = action.payload;
    },
  },
});

export const { setServices } = serviceSlice.actions;
export default serviceSlice.reducer;
