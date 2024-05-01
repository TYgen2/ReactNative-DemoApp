import { createDrawerNavigator } from "@react-navigation/drawer";
import { Icon } from "@rneui/themed";
import HomeScreen from "../pages/home";
import About from "../pages/about";
import CustomDrawer from "../components/customDrawer";

const NavDrawer = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveTintColor: "white",
        drawerInactiveTintColor: "white",
        drawerActiveBackgroundColor: "#483C32",
        drawerLabelStyle: {
          fontSize: 18,
          fontWeight: "normal",
        },
        drawerStyle: {
          overflow: "hidden",
          borderTopRightRadius: 30,
          borderBottomRightRadius: 30,
          backgroundColor: "#fff",
        },
        headerTransparent: true,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitleStyle: { color: "transparent" },
          drawerIcon: () => <Icon type="material" name="home" color="white" />,
        }}
      />
      <Drawer.Screen
        name="About"
        component={About}
        options={{
          headerTitleStyle: { color: "transparent" },
          drawerIcon: () => <Icon type="material" name="info" color="white" />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default NavDrawer;
