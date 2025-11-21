import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

import { RootState } from "../../src/store";
import Button from "@/src/component/Button";

const PRIMARY = "#0FB9B1";
const BG_DARK = "#0D0D0D";
const CARD_BG = "#1A1A1A";

const { width } = Dimensions.get("window");

const ServiceDetailsScreen = () => {
  const router: any = useRouter();
  const params = useLocalSearchParams();
  const serviceId = params.serviceId as string;

  const service = useSelector((state: RootState) =>
    state.services.list.find((s) => s.id === serviceId)
  );

  // Fade-in animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Service not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.name}>{service.name}</Text>
          <View style={styles.underline} />
        </View>

        {/* Animated Card */}
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardLabel}>Service Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{service.duration}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price</Text>
            <Text style={[styles.value, { color: PRIMARY }]}>
              ₹{service.price}
            </Text>
          </View>

          {service.description && (
            <View style={{ marginTop: 16 }}>
              <Text style={styles.label}>Description</Text>
              <Text style={styles.description}>{service.description}</Text>
            </View>
          )}
        </Animated.View>

        {/* Book Button */}
        <Button
          title="Book this service"
          onPress={() => router.push(`/booking/form?serviceId=${service.id}`)}
          style={{ marginTop: 32 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServiceDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK,
    paddingHorizontal: width * 0.05,
  },

  headerBox: {
    marginTop: 10,
    marginBottom: 20,
  },

  name: {
    fontSize: width * 0.075,
    fontWeight: "700",
    color: "#FFFFFF",
    maxWidth: "90%",
  },

  underline: {
    width: 60,
    height: 4,
    backgroundColor: PRIMARY,
    borderRadius: 4,
    marginTop: 6,
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: PRIMARY,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  cardLabel: {
    fontSize: width * 0.045,
    color: PRIMARY,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  label: {
    fontSize: width * 0.04,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },

  value: {
    fontSize: width * 0.04,
    color: "#fff",
    fontWeight: "600",
  },

  description: {
    color: "rgba(255,255,255,0.75)",
    fontSize: width * 0.038,
    marginTop: 4,
    lineHeight: 22,
  },

  errorText: {
    fontSize: 18,
    color: PRIMARY,
    textAlign: "center",
    marginTop: 40,
  },
});
