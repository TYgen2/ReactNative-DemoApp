import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { React, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { UpdateContext } from "../context/updateArt";

const windowWidth = Dimensions.get("window").width;

export default FavItem = ({ imgUrl, userId, artist, artistId, name }) => {
  const navigation = useNavigation();
  const { artList, setArtList } = useContext(UpdateContext);
  const idx = artList.map((e) => e.art).indexOf(imgUrl);

  return (
    <View style={styles.artList}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate("Full art", {
            idx: idx,
            name: name,
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
