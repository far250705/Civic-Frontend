// Screens/CivicReportingApp.js
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Add this import

// Civic Reporting Screens
import HomeScreen from "./HomeScreen";
import ReportScreen from "./ReportScreen";
import FeedScreen from "./FeedScreen";
import MyReportsScreen from "./MyReportsScreen";
import BottomNav from "../components/BottomNav";

const CivicReportingApp = ({ setIsLoggedIn }) => {
  const [activeScreen, setActiveScreen] = useState("home");
  const insets = useSafeAreaInsets(); // Get safe area insets

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f3f4f6" }}
      edges={["top", "bottom"]}
    >
      <StatusBar style="light" backgroundColor="#2563eb" />

      {/* Screen Content */}
      <View style={{ 
        flex: 1, 
        paddingBottom: 70 + insets.bottom // Add bottom inset padding
      }}>
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
      </View>

      {/* Bottom Navigation */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: insets.bottom, // Position above OS navigation bar
          backgroundColor: "white",
        }}
      >
        <BottomNav
          activeScreen={activeScreen}
          setActiveScreen={setActiveScreen}
        />
      </View>
    </SafeAreaView>
  );
};

export default CivicReportingApp;