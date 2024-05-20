import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { FormatArtist, FormatName } from "../utils/tools";
import { useTheme } from "../theme/themeProvider";
import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useEffect, useState } from "react";

export default searchItem = ({ guest, url, info }) => {
  const navigation = useNavigation();
  const userId = guest ? null : auth.currentUser.uid;

  const { colors } = useTheme();

  const art_name = FormatName(info);
  const art_artist = FormatArtist(info);

  const [status, setStatus] = useState();

  if (!guest) {
    const docRef = doc(db, "user", userId);

    useEffect(() => {
      const unsubscribe = onSnapshot(docRef, (doc) => {
        setStatus(doc.data()["art"].includes(url));
      });

      return () => unsubscribe();
    }, [url]);
  }

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        navigation.navigate("Full art", {
          name: art_name,
          imgUrl: url,
          fav: status,
          user: guest ? null : userId,
          onGoBack: (updatedStatus) => {
            setStatus(updatedStatus);
          },
        })
      }
    >
      <View style={styles.artInfo}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.title }}>
          {art_name}
        </Text>
        <Text style={{ fontSize: 14, color: colors.subtitle }}>
          {art_artist}
        </Text>
      </View>
      <Image source={{ uri: url }} style={{ flex: 1.8 }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    height: 80,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  artInfo: {
    flex: 1,
    justifyContent: "center",
  },
});
