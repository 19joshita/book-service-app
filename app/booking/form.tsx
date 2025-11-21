import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import uuid from "react-native-uuid";

import { RootState, AppDispatch } from "@/src/store";
import { addBookingAndSave } from "@/src/store/slices/bookingSlice";

import Input from "@/src/component/Input";
import Button from "@/src/component/Button";

const PRIMARY = "#0FB9B1";

const BookingSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  time: Yup.string().required("Time is required"),
});

const BookingFormScreen = () => {
  const router: any = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const serviceId = params.serviceId as string;
  const service = useSelector((state: RootState) =>
    state.services.list.find((s) => s.id === serviceId)
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!service) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "white" }}>Service not found.</Text>
      </SafeAreaView>
    );
  }

  const handleSubmitBooking = async (values: any) => {
    try {
      setLoading(true);
      const booking = {
        id: uuid.v4() as string,
        serviceId: service.id,
        serviceName: service.name,
        date: values.date,
        time: values.time,
        notes: values.notes,
      };

      await dispatch(addBookingAndSave(booking));
      router.push("/(tabs)/bookings");
    } catch (err) {
      Alert.alert("Booking Failed", "Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.title}>Book {service.name}</Text>

            <Formik
              initialValues={{ date: "", time: "", notes: "" }}
              validationSchema={BookingSchema}
              onSubmit={handleSubmitBooking}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.form}>
                  <Input
                    label="Service"
                    value={service.name}
                    editable={false}
                    labelColor="rgba(255,255,255,0.6)"
                    inputStyle={{ color: "white" }}
                  />

                  <View>
                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={styles.selectorInput}
                    >
                      <Text style={styles.selectorText}>
                        {values.date || "Select Date"}
                      </Text>
                    </TouchableOpacity>
                    {touched.date && errors.date && (
                      <Text style={styles.error}>{errors.date}</Text>
                    )}
                  </View>

                  {showDatePicker && (
                    <DateTimePicker
                      value={values.date ? new Date(values.date) : new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setFieldValue(
                            "date",
                            selectedDate.toISOString().split("T")[0]
                          );
                        }
                      }}
                    />
                  )}

                  <View>
                    <Text style={styles.label}>Time</Text>
                    <TouchableOpacity
                      onPress={() => setShowTimePicker(true)}
                      style={styles.selectorInput}
                    >
                      <Text style={styles.selectorText}>
                        {values.time || "Select Time"}
                      </Text>
                    </TouchableOpacity>
                    {touched.time && errors.time && (
                      <Text style={styles.error}>{errors.time}</Text>
                    )}
                  </View>

                  {showTimePicker && (
                    <DateTimePicker
                      value={
                        values.time
                          ? new Date(`1970-01-01T${values.time}:00`)
                          : new Date()
                      }
                      mode="time"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          const hh = String(selectedTime.getHours()).padStart(
                            2,
                            "0"
                          );
                          const mm = String(selectedTime.getMinutes()).padStart(
                            2,
                            "0"
                          );
                          setFieldValue("time", `${hh}:${mm}`);
                        }
                      }}
                    />
                  )}

                  <Input
                    label="Notes (optional)"
                    placeholder="Add notes"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={values.notes}
                    onChangeText={handleChange("notes")}
                    onBlur={handleBlur("notes")}
                    labelColor="rgba(255,255,255,0.6)"
                    inputStyle={{ color: "white" }}
                  />

                  <Button
                    title={loading ? "Booking..." : "Confirm Booking"}
                    onPress={handleSubmit as any}
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}
                  />

                  {loading && (
                    <ActivityIndicator
                      style={{ marginTop: 10 }}
                      size="small"
                      color={PRIMARY}
                    />
                  )}
                </View>
              )}
            </Formik>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BookingFormScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 25,
  },
  form: {
    gap: 18,
  },
  selectorInput: {
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: 14,
  },
  selectorText: {
    color: "white",
    fontSize: 16,
  },
  label: {
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
    fontSize: 14,
  },
  error: {
    color: "#ff6b6b",
    marginTop: 6,
    marginLeft: 4,
    fontSize: 13,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B1B1B",
  },
});
