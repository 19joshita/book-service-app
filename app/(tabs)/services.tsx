import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";

import ServiceCard from "@/src/component/ServiceCard";
import { RootState, AppDispatch } from "@/src/store";
import { filterServicesByName } from "@/src/utils/helpers";
import { Service } from "@/src/types/service";
import { setServices } from "@/src/store/slices/serviceSlice";
import { SERVICES } from "@/src/constants/dummyData";

const PRIMARY = "#0FB9B1";
const BG_DARK = "#0D0D0D";

const { width } = Dimensions.get("window");

const Services = () => {
  const router: any = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector((state: RootState) => state.services.list);

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Animate list items
  const fadeAnim = new Animated.Value(0);

  const filteredServices = filterServicesByName(services, searchQuery);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    dispatch(setServices(SERVICES));
    setRefreshing(false);
  };

  const renderItem = ({ item, index }: { item: Service; index: number }) => {
    const itemFade = new Animated.Value(0);

    Animated.timing(itemFade, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View style={{ opacity: itemFade }}>
        <ServiceCard
          service={item}
          onPress={() => router.push(`/services/${item.id}`)}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Services</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Loading */}
      {refreshing && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      )}

      {/* Empty State */}
      {!refreshing && filteredServices.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No services found.</Text>
          <Text style={styles.subEmpty}>
            Try changing your search or refresh the list.
          </Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Services List */}
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  );
};

export default Services;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG_DARK,
    paddingHorizontal: width * 0.04,
  },

  headerContainer: {
    marginTop: 10,
    marginBottom: 15,
  },

  header: {
    fontSize: width * 0.08,
    fontWeight: "700",
    color: PRIMARY,
    letterSpacing: 0.5,
  },

  searchWrapper: {
    width: "100%",
    marginBottom: 15,
  },

  searchInput: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: width * 0.035,
    color: "white",
    fontSize: width * 0.045,
  },

  loading: {
    marginTop: 20,
    alignItems: "center",
  },

  emptyContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#888",
  },
  subEmpty: {
    fontSize: 14,
    marginTop: 4,
    color: "#AAA",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  refreshBtn: {
    marginTop: 16,
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  refreshText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
