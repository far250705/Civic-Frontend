// App.js
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Auth Screens
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import ForgotPasswordScreen from "./Screens/ForgotPassword";

// Civic Reporting Screens
import HomeScreen from "./Screens/HomeScreen";
import ReportScreen from "./Screens/ReportScreen";
import FeedScreen from "./Screens/FeedScreen";
import MyReportsScreen from "./Screens/MyReportsScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Bottom Tab Navigation
function CivicTabs({ setIsLoggedIn }) {
  return (
    <>
      <Tab.Navigator
        screenOptions={{ headerShown: false, tabBarStyle: { height: 60 } }}
      >
        <Tab.Screen name="Home">
          {(props) => <MyReportsScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Report">
          {(props) => <ReportScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Feed">
          {(props) => <FeedScreen {...props} />}
        </Tab.Screen>
        <Tab.Screen name="MyReports">
          {(props) => <MyReportsScreen {...props} />}
        </Tab.Screen>
      </Tab.Navigator>

      {/* ✅ Logout button (floats above tabs) */}
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.removeItem("token");
          setIsLoggedIn(false);
        }}
        style={{
          position: "absolute",
          top: 40,
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
    </>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#2E7D32" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <Stack.Screen name="CivicApp">
              {() => <CivicTabs setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Login">
                {(props) => (
                  <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />
                )}
              </Stack.Screen>
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
