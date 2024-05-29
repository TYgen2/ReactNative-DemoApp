import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { React, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

const windowWidth = Dimensions.get("window").width;

export default UploadItem = ({ imgUrl, guest, user }) => {
  const navigation = useNavigation();
  const [status, setStatus] = useState();
  const docRef = doc(db, "user", user);

  if (!guest) {
    useEffect(() => {
      const unsubscribe = onSnapshot(docRef, (doc) => {
        setStatus(doc.data()["FavArt"].includes(imgUrl));
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
        onPress={() => {
          navigation.navigate("Full art", {
            imgUrl: imgUrl,
            fav: status,
            user: guest ? null : user,
            onGoBack: (updatedStatus) => {},
          });
        }}
      >
        <Image source={{ uri: imgUrl }} style={{ flex: 1 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  artList: {
    width: windowWidth / 3,
    height: windowWidth / 3,
    padding: 1,
  },
});
