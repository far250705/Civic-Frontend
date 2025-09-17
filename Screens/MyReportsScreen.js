import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";
// ✅ Put this at the top of MyReportsScreen.js
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return { backgroundColor: "orange" };
    case "approved":
    case "resolved":
      return { backgroundColor: "green" };
    case "rejected":
      return { backgroundColor: "red" };
    case "in progress":
      return { backgroundColor: "blue" };
    default:
      return { backgroundColor: "gray" };
  }
};

const MyReportsScreen = ({ setActiveScreen, onLogout }) => {
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const mockData = [
        {
          id: 1,
          category: "Road",
          description: "Pothole on Main Street",
          location: "Main Street, City",
          timeAgo: "2h ago",
          status: "In Progress",
        },
        {
          id: 2,
          category: "Electricity",
          description: "Street light not working",
          location: "2nd Avenue, City",
          timeAgo: "1d ago",
          status: "Resolved",
        },
        {
          id: 3,
          category: "Sanitation",
          description: "Garbage not collected",
          location: "Park Street, City",
          timeAgo: "3d ago",
          status: "Pending",
        },
      ];

      setTimeout(() => {
        setReportsData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchReports();
  }, []);

  return (
    <View style={styles.pageWrapper}>
      <Header title="My Reports" onBack={() => setActiveScreen("home")} />

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" style={{ flex: 1 }} />
        ) : (
          <ScrollView style={styles.content}>
            {/* My Reports List */}
            <View style={styles.reportsList}>
              {reportsData.map((report) => (
                <View key={report.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <Text style={styles.categoryText}>{report.category}</Text>
                    <View
                      style={[styles.statusBadge, getStatusColor(report.status)]}
                    >
                      <Text style={styles.statusText}>{report.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.description}>{report.description}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center", // ✅ center horizontally
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 400, // ✅ keep content boxed
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  logoutButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  logoutText: {
    color: "white",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  greenStatCard: {
    backgroundColor: "#F0FDF4",
  },
  orangeStatCard: {
    backgroundColor: "#FFF7ED",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 4,
  },
  greenStatNumber: {
    color: "#16A34A",
  },
  orangeStatNumber: {
    color: "#EA580C",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  reportsList: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 20,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
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
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  navItem: {
    fontSize: 14,
    color: "#6B7280",
  },
  activeNav: {
    color: "#2563EB",
    fontWeight: "600",
  },
});

export default MyReportsScreen;
