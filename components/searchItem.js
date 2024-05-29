import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FormatArtist, FormatName } from "../utils/tools";
import { useTheme } from "../context/themeProvider";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useEffect, useState } from "react";

export default searchItem = ({ guest, url, info, id }) => {
  const navigation = useNavigation();
  const userId = guest ? null : auth.currentUser.uid;

  const { colors } = useTheme();

  const art_name = FormatName(info);
  const art_artist = FormatArtist(info);
  const [artistIcon, setArtistIcon] = useState("");
  const [artistSign, setArtistSign] = useState("");

  const [status, setStatus] = useState();

  const getInfo = async () => {
    const artistDocRef = doc(db, "user", id);
    const docSnap = await getDoc(artistDocRef);

    if (docSnap.exists()) {
      setArtistIcon(docSnap.data()["Info"]["icon"]);
      setArtistSign(docSnap.data()["Info"]["sign"]);
    } else {
      console.log("No such document!");
    }
  };

  if (!guest) {
    const docRef = doc(db, "user", userId);

    useEffect(() => {
      getInfo();

      const unsubscribe = onSnapshot(docRef, (doc) => {
        setStatus(doc.data()["FavArt"].includes(url));
      });

      return () => unsubscribe();
    }, [url]);
  } else {
    useEffect(() => {
      getInfo();
      setStatus(false);
    }, []);
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
      <TouchableOpacity
        onPress={() => {
          navigation.push("Profile", {
            id: id,
            name: art_artist,
            sign: artistSign,
            icon: artistIcon,
          });
        }}
        style={{
          width: 40,
          height: 40,
          alignSelf: "center",
        }}
      >
        {artistIcon === "" ? (
          <ActivityIndicator size="small" color="#483C32" />
        ) : (
          <Image
            source={{ uri: artistIcon }}
            style={{
              flex: 1,
              resizeMode: "cover",
              width: 40,
              borderRadius: 40,
            }}
          />
        )}
      </TouchableOpacity>
      <View style={styles.artInfo}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.title }}>
          {art_name}
        </Text>
        <Text style={{ fontSize: 14, color: colors.subtitle }}>
          {art_artist}
        </Text>
      </View>
      <Image source={{ uri: url }} style={{ flex: 2 }} />
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
    justifyContent: "center",
  },
  artInfo: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
});
