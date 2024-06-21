import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  LogBox,
  Text,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { DelArt, SaveArt } from "../../services/fav";
import { NotifyMessage, Uncapitalize, saveImg, sleep } from "../../utils/tools";
import AlertAsync from "react-native-alert-async";
import Toast from "react-native-toast-message";
import { Capitalize } from "../../utils/tools";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { UpdateContext } from "../../context/updateArt";
import { getMetadata, getStorage, ref, updateMetadata } from "firebase/storage";

const IGNORED_LOGS = [
  "Non-serializable values were found in the navigation state",
];

LogBox.ignoreLogs(IGNORED_LOGS);

const Fullscreen = ({ route }) => {
  const navigation = useNavigation();
  const { imgUrl, user, artistId, artist, fav, name, idx } = route.params;
  const { artList, setArtList } = useContext(UpdateContext);

  // state for controlling fav icon, and responsible for passing the
  // most updated status back to artItem screen.
  const [updatedStatus, setUpdatedStatus] = useState(fav);
  const [showExtra, setShowExtra] = useState(true);
  const [icon, setIcon] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // handle update likes in Storage
  const tapToLike = (art) => {
    const storage = getStorage();
    const artRef = ref(storage, `arts/${art}`);

    // get and update real-time likes
    getMetadata(artRef).then((res) => {
      const likes = parseInt(res["customMetadata"]["likes"]);

      const metadata = {
        customMetadata: {
          // when true, it means user just unfaved it, then likes--
          likes: updatedStatus ? likes - 1 : likes + 1,
        },
      };

      updateMetadata(artRef, metadata);
    });
  };

  // update likes in artList(local)
  const updateLikes = (index, newLikes) => {
    const updatedList = [...artList];
    updatedList[index].likes = newLikes;
    return updatedList;
  };
  const handleLikeUpdate = (index) => {
    const res = parseInt(artList[index].likes);
    const newLikesValue = updatedStatus ? res - 1 : res + 1;
    const updatedList = updateLikes(index, newLikesValue);
    setArtList(updatedList);
  };

  const getIcon = async () => {
    // get target artist icon from firestore by their uid
    const artistDocRef = doc(db, "user", artistId);
    const docSnap = await getDoc(artistDocRef);

    if (docSnap.exists()) {
      setIcon(docSnap.data()["Info"]["icon"]);
    } else {
      console.log("No such document!");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getIcon();
  }, []);

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
            {isLoading ? (
              <ActivityIndicator size="small" color="#483C32" />
            ) : (
              <Image
                source={{ uri: icon }}
                style={{
                  flex: 1,
                  resizeMode: "cover",
                  width: 60,
                  borderRadius: 60,
                }}
              />
            )}
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
          source={{ uri: imgUrl }}
          style={{ flex: 1, resizeMode: "contain", zIndex: 1 }}
        />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        {/* save to local button */}
        <TouchableOpacity
          style={[styles.button, { opacity: showExtra ? 1 : 0 }]}
          disabled={showExtra ? false : true}
          onPress={() => saveImg(imgUrl, name)}
        >
          <Icon name="download" type="material" color="black" size={24} />
        </TouchableOpacity>
        {/* fav/delete button */}
        <TouchableOpacity
          style={[styles.button, { opacity: showExtra ? 1 : 0 }]}
          disabled={showExtra ? false : true}
          onPress={async () => {
            const info = Uncapitalize(name) + "_" + Capitalize(artist) + ".jpg";
            const art = {
              artName: name,
              artist: Capitalize(artist),
              artwork: imgUrl,
              artistId: artistId,
            };

            // guest mode
            if (!user) {
              NotifyMessage("Sign in to use the Favourite function.");
              return;
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
                handleLikeUpdate(idx);
                tapToLike(info);
                DelArt(user, art);
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
              handleLikeUpdate(idx);
              tapToLike(info);
              SaveArt(user, art);
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
    justifyContent: "center",
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
