// App.js
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

// Screens
import ProfileScreen from "./Screens/ProfileScreen";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import ForgotPasswordScreen from "./Screens/ForgotPassword";
import CivicReportingApp from "./Screens/CivicReportingApp";

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#2E7D32" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <>
              {/* Civic Reporting App */}
              <Stack.Screen name="CivicApp">
                {(props) => <CivicReportingApp {...props} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>

              {/* Profile Screen */}
              <Stack.Screen name="Profile">
                {(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              {/* Login Screen */}
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
              </Stack.Screen>

              {/* Register & Forgot Password Screens */}
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
