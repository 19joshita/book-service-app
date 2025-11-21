import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Booking } from "../types/booking";

interface BookingCardProps {
  booking: Booking;
  onDelete?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onDelete }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{booking.serviceName}</Text>
      <Text style={styles.details}>
        {booking.date} at {booking.time}
      </Text>
      {booking.notes && <Text style={styles.notes}>{booking.notes}</Text>}
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BookingCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  details: {
    marginTop: 4,
    color: "#555",
  },
  notes: {
    marginTop: 4,
    fontStyle: "italic",
    color: "#777",
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  deleteText: {
    color: "red",
    fontWeight: "600",
  },
});
