import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { delArt, saveArt } from "../../services/fav";

const Fullscreen = ({ route }) => {
  const navigation = useNavigation();

  const url = route.params.imgUrl;
  const userId = route.params.user;
  // state for controlling fav icon, and responsible for passing the
  // most updated status back to artItem screen.
  const [updatedStatus, setUpdatedStatus] = useState(route.params.fav);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => {
          route.params.onGoBack(updatedStatus);
          navigation.goBack();
        }}
      >
        <Image
          source={{ uri: url }}
          style={{ flex: 1, resizeMode: "contain" }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          // faved, delete now
          if (updatedStatus) {
            delArt(userId, url);
            setUpdatedStatus(false);
          }
          // not faved, fav now
          else {
            saveArt(userId, url);
            setUpdatedStatus(true);
          }
        }}
      >
        <Icon
          name={updatedStatus ? "delete" : "heart"}
          type={updatedStatus ? "materialicons" : "antdesign"}
          color={updatedStatus ? "black" : "#ff5152"}
          size={24}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Fullscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  buttonContainer: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    right: 20,
    padding: 20,
    borderRadius: 50,
  },
});
