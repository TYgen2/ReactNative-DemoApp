import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@rneui/themed";
import * as Animatable from "react-native-animatable";
import TabArr from "../components/tabInfo";

const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const textViewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({ 0: { scale: 0.7 }, 1: { scale: 1 } });
      textViewRef.current.animate({ 0: { scale: 0.7 }, 1: { scale: 1 } });
    } else {
      viewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
      textViewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 0 } });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      style={[styles.tab, { flex: focused ? 1 : 0.7 }]}
      onPress={onPress}
      activeOpacity={1}
    >
      <View>
        <Animatable.View
          ref={viewRef}
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: item.bgColor,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: "white",
            },
          ]}
        />
        <View style={styles.button}>
          <Icon
            name={item.icon}
            type={item.type}
            color={focused ? item.color : "grey"}
          />

          <Animatable.View ref={textViewRef}>
            {focused && (
              <Text style={[styles.tabLabel, { color: item.color }]}>
                {item.label}
              </Text>
            )}
          </Animatable.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: "transparent",
          height: 70,
          borderRadius: 30,
          marginHorizontal: 80,
          bottom: 10,
          elevation: 0,
          backgroundColor: "transparent",
        },
      }}
    >
      {TabArr.map((item) => {
        return (
          <Tab.Screen
            key={""}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarLabel: item.label,
              tabBarIcon: ({ focused }) => (
                <Icon
                  name={item.icon}
                  type={item.type}
                  color={focused ? item.color : "grey"}
                />
              ),
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // dark: "#28282B"
    backgroundColor: "#f2f2f2",
  },
  art: {
    height: 200,
    width: 200,
    borderRadius: 20,
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  tabLabel: {
    fontWeight: "bold",
    paddingHorizontal: 6,
  },
});
