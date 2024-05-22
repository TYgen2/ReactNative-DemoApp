import { createStackNavigator } from "@react-navigation/stack";
import IntroPage from "../pages/intro";
import SignIn from "../pages/sign_in";
import Register from "../pages/register";
import NavDrawer from "./drawer";
import Fullscreen from "../pages/fullscreen/fullscreen_art";

const Stack = createStackNavigator();

const NavStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Intro"
        component={IntroPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sign in"
        component={SignIn}
        options={{ headerShown: true, headerTransparent: true }}
      />
      <Stack.Screen
        name="Sign up"
        component={Register}
        options={{ headerShown: true, headerTransparent: true }}
      />
      <Stack.Screen
        name="Inside"
        component={NavDrawer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Full art"
        component={Fullscreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default NavStack;
