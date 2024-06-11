import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { React, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const windowWidth = Dimensions.get("window").width;

export default FavItem = ({ imgUrl, userId, artist, artistId }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.artList}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate("Full art", {
            name: "faved",
            artist: artist,
            imgUrl: imgUrl,
            fav: true,
            user: userId,
            artistId: artistId,
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
    width: (windowWidth / 2) * 0.9,
    height: (windowWidth / 2) * 0.9,
  },
});
