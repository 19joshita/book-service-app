import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Service } from "../types/service";

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
}

const PRIMARY = "#0FB9B1";
const BG_CARD = "#1A1A1A";
const TEXT_LIGHT = "#FFFFFF";

const { width } = Dimensions.get("window");

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.price}>₹{service.price}</Text>
      </View>

      <Text style={styles.duration}>{service.duration}</Text>
    </TouchableOpacity>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 18,
    marginBottom: 14,
    backgroundColor: BG_CARD,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: PRIMARY,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: TEXT_LIGHT,
  },

  price: {
    fontSize: width * 0.045,
    fontWeight: "700",
    color: PRIMARY,
  },

  duration: {
    marginTop: 6,
    fontSize: width * 0.038,
    color: "rgba(255,255,255,0.6)",
  },
});
