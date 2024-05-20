import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import NavStack from "./navigations/stack";
import Toast from "react-native-toast-message";
import { ThemeProvider } from "./theme/themeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <NavStack />
        <Toast />
      </NavigationContainer>
    </ThemeProvider>
  );
}
