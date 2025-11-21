import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking } from "../types/booking";

const STORAGE_KEY = "@bookings";

export const saveBookings = async (bookings: Booking[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error("Error saving bookings", error);
  }
};

export const loadBookings = async (): Promise<Booking[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading bookings", error);
    return [];
  }
};

export const deleteBooking = async (id: string): Promise<void> => {
  try {
    const bookings = await loadBookings();
    const updated = bookings.filter((b) => b.id !== id);
    await saveBookings(updated);
  } catch (error) {
    console.error("Error deleting booking", error);
  }
};
