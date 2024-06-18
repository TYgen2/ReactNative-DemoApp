import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { React, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { DeleteArtFromFB } from "../services/fav";
import { deleteObject, getStorage, ref } from "firebase/storage";
import AlertAsync from "react-native-alert-async";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Icon } from "@rneui/themed";
import { UpdateContext } from "../context/updateArt";
import { Capitalize } from "../utils/tools";
import Toast from "react-native-toast-message";

const windowWidth = Dimensions.get("window").width;

const storage = getStorage();

const UploadItem = ({ imgUrl, guest, user, artist, target }) => {
  const navigation = useNavigation();
  const [status, setStatus] = useState();
  const docRef = doc(db, "user", user);
  const myUser = user === target ? true : false;

  const { artList, setArtList } = useContext(UpdateContext);
  const deleteFromArtList = (img) => {
    const newList = artList.filter((art) => art["art"] !== img);
    setArtList(newList);
  };

  const deleteO = useSharedValue(0);
  const deleteS = useSharedValue(0);
  const deleteW = useSharedValue(0);
  const deleteH = useSharedValue(0);
  const deleteY = useSharedValue(0);
  const [showed, setShowed] = useState(false);

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      width: deleteW.value,
      height: deleteH.value,
      opacity: deleteO.value,
      transform: [{ scale: deleteS.value }, { translateY: deleteY.value }],
    };
  }, []);

  const handleDeleteAnimation = () => {
    deleteO.value = withTiming(0.8, { duration: 500 });
    deleteS.value = withTiming(1, { duration: 500 });
    deleteW.value = withTiming(80, { duration: 500 });
    deleteH.value = withTiming(80, { duration: 500 });
    deleteY.value = withTiming(25, { duration: 500 });
    setShowed(true);
  };

  const handleResetAnimation = () => {
    deleteO.value = withSpring(0);
    deleteS.value = withSpring(0);
    deleteW.value = withSpring(0);
    deleteH.value = withSpring(0);
    deleteY.value = withSpring(0);
    setShowed(false);
  };

  if (!guest) {
    useEffect(() => {
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.data()["FavArt"].some((e) => e["artwork"] === imgUrl)) {
          setStatus(true);
        } else {
          setStatus(false);
        }
      });

      return () => unsubscribe();
    }, []);
  } else {
    useEffect(() => {
      setStatus(false);
    }, []);
  }

  return (
    <View style={styles.artList}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={0.8}
        onLongPress={async () => {
          if (!myUser) {
            return;
          }
          if (!showed) {
            handleDeleteAnimation();
          } else {
            handleResetAnimation();
          }
        }}
        onPress={() => {
          if (!showed) {
            navigation.navigate("Full art", {
              imgUrl: imgUrl,
              fav: status,
              artist: artist,
              user: guest ? null : user,
              artistId: myUser ? user : target,
              onGoBack: (updatedStatus) => {},
            });
          } else {
            handleResetAnimation();
          }
        }}
      >
        <Image source={{ uri: imgUrl }} style={{ flex: 1 }} />
        <TouchableOpacity
          style={{ position: "absolute", alignSelf: "center" }}
          onPress={async () => {
            const choice = await AlertAsync(
              "Caution❗",
              "Are you sure you want to delete this art permanently?",
              [
                { text: "Yes", onPress: () => "yes" },
                { text: "No", onPress: () => Promise.resolve("no") },
              ],
              {
                cancelable: true,
                onDismiss: () => {
                  "no", handleResetAnimation();
                },
              }
            );
            // deletion
            if (choice === "yes") {
              const art = {
                artist: Capitalize(artist),
                artwork: imgUrl,
                artistId: user,
              };

              // delete from Firestore
              DeleteArtFromFB(user, art);

              // delete from storage
              const artRef = ref(storage, imgUrl);
              deleteObject(artRef)
                .then(() => {
                  console.log("Art deleted from storage.");
                })
                .catch((e) => {
                  console.error(e);
                });

              deleteFromArtList(imgUrl);

              Toast.show({
                type: "success",
                text1: "Successfully deleted.",
                position: "bottom",
                visibilityTime: 2000,
              });
            } else {
              return;
            }
          }}
        >
          <Animated.View style={[reanimatedStyle, styles.deleteConfirm]}>
            <Icon name="delete" type="materialicons" color="black" size={40} />
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default UploadItem;

const styles = StyleSheet.create({
  artList: {
    width: windowWidth / 3,
    height: windowWidth / 3,
    padding: 1,
  },
  deleteConfirm: {
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "white",
    backgroundColor: "#EADDCA",
    justifyContent: "center",
  },
});
