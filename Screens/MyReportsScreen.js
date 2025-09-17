import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
import API from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyReportsScreen = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Unauthorized", "Please log in again");
        setLoading(false);
        return;
      }

      const res = await API.get("posts/my/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReports(res.data.posts || []);
    } catch (err) {
      console.error("Fetch reports error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.msg || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const getMediaUrl = (path) => {
    if (!path) return null;
    return `http://172.16.78.68:5000/${path.replace("\\", "/")}`;
  };

  return (
    <View style={styles.container}>
      <Header title="My Reports" showBack onBack={() => navigation.goBack()} />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {reports.length === 0 ? (
            <Text style={styles.noReports}>
              You haven’t created any reports yet
            </Text>
          ) : (
            <View style={styles.reportsList}>
              {reports.map((report) => (
                <View key={report._id} style={styles.reportCard}>
                  <Text style={styles.description}>{report.description}</Text>

                  {report.media && report.media.length > 0 && (
                    <Image
                      source={{ uri: getMediaUrl(report.media[0]) }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  )}

                  <View style={styles.reportFooter}>
                    <View style={styles.userContainer}>
                      <Ionicons name="person" size={12} color="#6B7280" />
                      <Text style={styles.footerText}>
                        {report.user?.username}
                      </Text>
                    </View>

                    <View style={styles.locationContainer}>
                      <Ionicons name="location" size={12} color="#6B7280" />
                      <Text style={styles.footerText}>
                        {report.location?.coordinates?.[1]},
                        {report.location?.coordinates?.[0]}
                      </Text>
                    </View>

                    <View style={styles.timeContainer}>
                      <Ionicons name="time" size={12} color="#6B7280" />
                      <Text style={styles.footerText}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  content: { flex: 1, padding: 16 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  noReports: {
    textAlign: "center",
    marginTop: 20,
    color: "#6B7280",
    fontSize: 16,
  },
  reportsList: { gap: 12 },
  reportCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: "500",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  reportFooter: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
  },
});

export default MyReportsScreen;
