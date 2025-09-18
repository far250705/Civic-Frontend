import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Plus, List, User, MapPin } from "lucide-react-native";
import Header from "../components/Header";
import API from "../utils/api"; // ✅ use your axios instance

const HomeScreen = ({ setActiveScreen }) => {
  const [stats, setStats] = useState({
    totalReports: 0,
    resolved: 0,
    inProgress: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch stats from backend API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/posts/stats"); // 👈 correct API call
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const mockReports = [
    {
      id: "1",
      description: "Pothole on Main Street",
      status: "In Progress",
      timeAgo: "2h ago",
      location: "Main Street, City",
    },
    {
      id: "2",
      description: "Street light not working",
      status: "Resolved",
      timeAgo: "1d ago",
      location: "2nd Avenue, City",
    },
    {
      id: "3",
      description: "Garbage not collected",
      status: "Pending",
      timeAgo: "3d ago",
      location: "Park Street, City",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "#16a34a"; // green
      case "In Progress":
        return "#f97316"; // orange
      case "Pending":
        return "#f59e0b"; // yellow
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <Header title="Civic Reporter" />

      {/* Quick Stats */}
      <View style={{ padding: 16, backgroundColor: "#f0f7ff" }}>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" />
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                marginHorizontal: 4,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 12,
                alignItems: "center",
                elevation: 2,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#2563eb" }}
              >
                {stats.totalReports}
              </Text>
              <Text style={{ fontSize: 12, color: "#4b5563" }}>
                Total Reports
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                marginHorizontal: 4,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 12,
                alignItems: "center",
                elevation: 2,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#16a34a" }}
              >
                {stats.resolved}
              </Text>
              <Text style={{ fontSize: 12, color: "#4b5563" }}>Resolved</Text>
            </View>

            <View
              style={{
                flex: 1,
                marginHorizontal: 4,
                backgroundColor: "white",
                borderRadius: 12,
                padding: 12,
                alignItems: "center",
                elevation: 2,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#f97316" }}
              >
                {stats.inProgress}
              </Text>
              <Text style={{ fontSize: 12, color: "#4b5563" }}>
                In Progress
              </Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <TouchableOpacity
          onPress={() => setActiveScreen("report")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2563eb",
            padding: 14,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Plus size={24} color="white" />
          <Text style={{ color: "white", fontWeight: "600", marginLeft: 8 }}>
            Report New Issue
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => setActiveScreen("feed")}
            style={{
              flex: 1,
              marginRight: 6,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <List size={20} color="#4b5563" />
            <Text style={{ marginLeft: 6, fontWeight: "500", color: "#374151" }}>
              View Feed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveScreen("my-reports")}
            style={{
              flex: 1,
              marginLeft: 6,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <User size={20} color="#4b5563" />
            <Text style={{ marginLeft: 6, fontWeight: "500", color: "#374151" }}>
              My Reports
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 12,
            color: "#1f2937",
          }}
        >
          Recent in Your Area
        </Text>

        {mockReports.length === 0 ? (
          <Text style={{ color: "#6b7280" }}>No recent reports</Text>
        ) : (
          mockReports.slice(0, 2).map((report) => (
            <View
              key={report.id}
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#f3f4f6",
                elevation: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: "500",
                    backgroundColor: getStatusColor(report.status),
                    color: "white",
                  }}
                >
                  {report.status}
                </Text>
                <Text style={{ fontSize: 12, color: "#6b7280" }}>
                  {report.timeAgo}
                </Text>
              </View>

              <Text
                style={{
                  fontWeight: "500",
                  color: "#1f2937",
                  marginBottom: 4,
                }}
              >
                {report.description}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MapPin size={14} color="#6b7280" style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 12, color: "#6b7280" }}>
                  {report.location}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
