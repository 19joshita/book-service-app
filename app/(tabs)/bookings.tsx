import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AppDispatch, RootState } from "@/src/store";
import {
  deleteBookingAndSave,
  loadStoredBookings,
} from "@/src/store/slices/bookingSlice";

const PRIMARY = "#0FB9B1";

const BookingsListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { list } = useSelector((state: RootState) => state.bookings);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNotes, setExpandedNotes] = useState<{
    [key: string]: boolean;
  }>({});

  // Load bookings from storage
  const loadBookings = async () => {
    try {
      setError(null);
      setLoading(true);
      await dispatch(loadStoredBookings());
    } catch {
      setError("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    // Animate deletion
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch(deleteBookingAndSave(id));
  };

  const toggleReadMore = (id: string) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter bookings by service name
  const filteredList = list.filter((item) =>
    item.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBookingCard = (item: any) => {
    const isExpanded = expandedNotes[item.id] || false;
    const shouldTruncate = item.notes && item.notes.length > 50;
    const displayedNotes =
      shouldTruncate && !isExpanded
        ? `${item.notes.slice(0, 50)}...`
        : item.notes;

    return (
      <View style={styles.card}>
        <Text style={styles.serviceName}>{item.serviceName}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color={PRIMARY} />
          <Text style={styles.infoText}>{item.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color={PRIMARY} />
          <Text style={styles.infoText}>{item.time}</Text>
        </View>

        {item.notes ? (
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={18} color={PRIMARY} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoText}>{displayedNotes}</Text>
              {shouldTruncate && (
                <TouchableOpacity onPress={() => toggleReadMore(item.id)}>
                  <Text style={styles.readMore}>
                    {isExpanded ? "Read less" : "Read more"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : null}

        <View style={styles.infoRow}>
          <Ionicons name="key-outline" size={18} color={PRIMARY} />
          <Text style={styles.infoText}>ID: {item.id}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cube-outline" size={18} color={PRIMARY} />
          <Text style={styles.infoText}>Service ID: {item.serviceId}</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator
          size="large"
          color={PRIMARY}
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Your Bookings</Text>

      {/* Search */}
      {list.length > 0 && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search bookings..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      )}

      {/* Empty State */}
      {filteredList.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bookings found.</Text>
          <Text style={styles.subEmpty}>Book a service to get started!</Text>

          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => router.push("/services")}
          >
            <Text style={styles.bookBtnText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bookings List */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderBookingCard(item)}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

export default BookingsListScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 16,
  },

  // Search
  searchInput: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "white",
    fontSize: 16,
    marginBottom: 16,
  },

  // Empty State
  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#AAAAAA",
  },
  subEmpty: {
    fontSize: 15,
    marginTop: 4,
    color: "#888",
  },
  bookBtn: {
    marginTop: 20,
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  bookBtnText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },

  // Booking Card
  card: {
    backgroundColor: "#2A2A2A",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#FFFFFF",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  infoText: {
    color: "#FFFFFF",
    fontSize: 15,
    marginLeft: 8,
    flexShrink: 1,
  },
  readMore: {
    color: PRIMARY,
    marginTop: 4,
    fontWeight: "600",
    fontSize: 14,
  },

  deleteBtn: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FF3B30",
    alignItems: "center",
  },
  deleteText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },

  // Error
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    fontSize: 16,
    marginTop: 50,
  },
});
