import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  LogBox,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { delArt, saveArt } from "../../services/fav";
import { NotifyMessage, saveImg } from "../../utils/tools";
import AlertAsync from "react-native-alert-async";
import Toast from "react-native-toast-message";

const IGNORED_LOGS = [
  "Non-serializable values were found in the navigation state",
];

LogBox.ignoreLogs(IGNORED_LOGS);

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => saveImg(url, route.params.name)}
        >
          <Icon name="download" type="material" color="black" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            // guest mode
            if (!userId) {
              NotifyMessage("Sign in to use the Favourite function.");
            }
            // faved, delete now
            else if (updatedStatus) {
              const choice = await AlertAsync(
                "Caution❗",
                "Are you sure you want to remove this art from your favourited list?",
                [
                  { text: "Yes", onPress: () => "yes" },
                  { text: "No", onPress: () => Promise.resolve("no") },
                ],
                {
                  cancelable: true,
                  onDismiss: () => "no",
                }
              );
              if (choice === "yes") {
                delArt(userId, url);
                setUpdatedStatus(false);
                navigation.goBack();
                Toast.show({
                  type: "success",
                  text1: "Successfully deleted.",
                  position: "bottom",
                  visibilityTime: 2000,
                });
              } else {
                return;
              }
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
    </View>
  );
};

export default Fullscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  button: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 4,
    borderRadius: 50,
  },
  buttonContainer: {
    position: "absolute",
    flexDirection: "row",
    bottom: 10,
    right: 10,
  },
});
