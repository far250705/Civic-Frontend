// Screens/CivicReportingApp.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Civic Reporting Screens
import HomeScreen from "./HomeScreen";
import ReportScreen from "./ReportScreen";
import FeedScreen from "./FeedScreen";
import MyReportsScreen from "./MyReportsScreen";
import BottomNav from "../components/BottomNav";
import Dashboard  from "./Testing";
const CivicReportingApp = ({ setIsLoggedIn }) => {
  const [activeScreen, setActiveScreen] = useState("home");

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6", paddingBottom: 80 }}>
      {/* Screens */}
      {activeScreen === "home" && (
        <HomeScreen setActiveScreen={setActiveScreen} />
      )}
      {activeScreen === "report" && (
        <ReportScreen setActiveScreen={setActiveScreen} />
      )}
      {activeScreen === "feed" && (
        <FeedScreen setActiveScreen={setActiveScreen} />
      )}
      {activeScreen === "my-reports" && (
        <MyReportsScreen setActiveScreen={setActiveScreen} />
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />

      {/* Logout Button */}
   <TouchableOpacity
  onPress={async () => {
    await AsyncStorage.removeItem("token"); // ✅ clear JWT
    setIsLoggedIn(false);                   // ✅ go back to login
  }}
  style={{
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  }}
>
  <Text style={{ color: "white", fontWeight: "bold" }}>Logout</Text>
</TouchableOpacity>
    </View>
  );
};

export default CivicReportingApp;
