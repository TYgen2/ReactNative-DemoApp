import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  LogBox,
  Text,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { DelArt, SaveArt } from "../../services/fav";
import { NotifyMessage, saveImg } from "../../utils/tools";
import AlertAsync from "react-native-alert-async";
import Toast from "react-native-toast-message";
import { Capitalize } from "../../utils/tools";

const IGNORED_LOGS = [
  "Non-serializable values were found in the navigation state",
];

LogBox.ignoreLogs(IGNORED_LOGS);

const Fullscreen = ({ route }) => {
  const navigation = useNavigation();

  const url = route.params.imgUrl;
  const userId = route.params.user;
  const artistIcon = route.params.icon;
  const artist = route.params.artist;

  // state for controlling fav icon, and responsible for passing the
  // most updated status back to artItem screen.
  const [updatedStatus, setUpdatedStatus] = useState(route.params.fav);
  const [showExtra, setShowExtra] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={() => {
          setShowExtra(!showExtra);
          route.params.onGoBack(updatedStatus);
        }}
      >
        <View style={styles.artistInfo}>
          <TouchableOpacity
            style={[styles.icon, { opacity: showExtra ? 1 : 0 }]}
            disabled={true}
          >
            <Image
              source={{ uri: artistIcon }}
              style={{
                flex: 1,
                resizeMode: "cover",
                width: 60,
                borderRadius: 60,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.artist, { opacity: showExtra ? 1 : 0 }]}
            disabled={true}
          >
            <Text style={styles.artistText}>{artist}</Text>
          </TouchableOpacity>
        </View>

        {/* fullscreen of art */}
        <Image
          source={{ uri: url }}
          style={{ flex: 1, resizeMode: "contain", zIndex: 1 }}
        />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        {/* save to local button */}
        <TouchableOpacity
          style={[styles.button, { opacity: showExtra ? 1 : 0 }]}
          disabled={showExtra ? false : true}
          onPress={() => saveImg(url, route.params.name)}
        >
          <Icon name="download" type="material" color="black" size={24} />
        </TouchableOpacity>
        {/* fav/delete button */}
        <TouchableOpacity
          style={[styles.button, { opacity: showExtra ? 1 : 0 }]}
          disabled={showExtra ? false : true}
          onPress={async () => {
            const art = {
              artist: Capitalize(artist),
              icon: artistIcon,
              artwork: url,
            };

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
                DelArt(userId, art);
                setUpdatedStatus(false);
                navigation.goBack();
                Toast.show({
                  type: "success",
                  text1: "Successfully deleted.",
                  position: "top",
                  visibilityTime: 2000,
                });
              } else {
                return;
              }
            }
            // not faved, fav now
            else {
              SaveArt(userId, art);
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
    justifyContent: "space-between",
    bottom: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  artistInfo: {
    flexDirection: "row",
    position: "absolute",
    top: 60,
    left: 8,
    zIndex: 2,
  },
  artist: {
    justifyContent: "center",
    paddingLeft: 10,
  },
  artistText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
