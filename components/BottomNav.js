import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Home, Plus, List, User } from "lucide-react-native";

const BottomNav = ({ activeScreen, setActiveScreen }) => {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "report", icon: Plus, label: "Report" },
    { id: "feed", icon: List, label: "Feed" },
    { id: "my-reports", icon: User, label: "My Reports" },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = activeScreen === item.id;
        const Icon = item.icon;

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => setActiveScreen(item.id)}
            style={[styles.button, isActive && styles.activeButton]}
          >
            <Icon size={24} color={isActive ? "#2563eb" : "#6b7280"} />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 8,
    elevation: 4, // shadow for Android
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 12,
  },
  activeButton: {
    backgroundColor: "#eff6ff", // blue-50
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
    fontWeight: "500",
  },
  activeLabel: {
    color: "#2563eb",
  },
});

export default BottomNav;
