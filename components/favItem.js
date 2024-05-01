import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { React } from "react";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;

export default FavItem = ({ imgUrl, userId }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.artList}>
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate("Full art", {
            imgUrl: imgUrl,
            fav: true,
            user: userId,
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
    marginHorizontal: 4,
    marginVertical: 4,
    justifyContent: "center",
  },
});
