import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import { handleSignOut } from "../services/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const CustomDrawer = (props) => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.replace("Intro");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.header}>
      <View style={{ flex: 0.3 }}>
        <Image
          source={require("../assets/chiori.jpg")}
          style={styles.headerImage}
        />
      </View>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#1f1f1f", flex: 1 }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity
        style={styles.bottomItem}
        activeOpacity={0.9}
        onPress={() => handleSignOut()}
      >
        <Icon type="material" name="logout" color="white" />
        <Text style={styles.itemText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  headerImage: {
    width: "100%",
    height: undefined,
    paddingTop: 400,
    opacity: 0.9,
  },
  bottomItem: {
    backgroundColor: "#1f1f1f",
    flexDirection: "row",
    paddingTop: 20,
    paddingLeft: 18,
    paddingBottom: 20,
  },
  itemText: {
    color: "white",
    fontSize: 18,
    paddingLeft: 30,
  },
});
