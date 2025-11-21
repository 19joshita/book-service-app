import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking } from "../../types/booking";

interface BookingsState {
  list: Booking[];
  loading: boolean;
}

const STORAGE_KEY = "@bookings";

const initialState: BookingsState = {
  list: [],
  loading: false,
};

// Load bookings from AsyncStorage
export const loadStoredBookings = createAsyncThunk(
  "bookings/loadStored",
  async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
);

// Add booking and save to storage
export const addBookingAndSave = createAsyncThunk(
  "bookings/addBooking",
  async (booking: Booking, { getState }) => {
    const state = getState() as { bookings: BookingsState };
    const updatedList = [...state.bookings.list, booking];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return booking;
  }
);

// Delete booking and save to storage
export const deleteBookingAndSave = createAsyncThunk(
  "bookings/deleteBooking",
  async (id: string, { getState }) => {
    const state = getState() as { bookings: BookingsState };
    const updatedList = state.bookings.list.filter((b) => b.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return id;
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadStoredBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        loadStoredBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.list = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        addBookingAndSave.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.list.push(action.payload);
        }
      )
      .addCase(
        deleteBookingAndSave.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.list = state.list.filter((b) => b.id !== action.payload);
        }
      );
  },
});

export default bookingSlice.reducer;
