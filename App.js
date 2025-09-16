import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Auth Screens
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import ForgotPasswordScreen from "./Screens/ForgotPassword";

// Civic Reporting App
import CivicReportingApp from "./Screens/CivicReportingApp";

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in storage
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) setIsLoggedIn(true);
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) return null; // or a loading spinner

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#2E7D32" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <Stack.Screen name="CivicApp">
              {() => <CivicReportingApp setIsLoggedIn={setIsLoggedIn} />}
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
