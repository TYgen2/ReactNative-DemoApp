import { Icon } from "@rneui/themed";
import { DelArt, SaveArt } from "../services/fav";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { React, useState, useEffect } from "react";
import { FormatName, FormatArtist, NotifyMessage } from "../utils/tools";
import { auth, db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { getMetadata, getStorage, ref, updateMetadata } from "firebase/storage";

export default artItem = ({ guest, url, info, id, likes, width, left }) => {
  const navigation = useNavigation();
  const userId = guest ? null : auth.currentUser.uid;

  const art_name = FormatName(info);
  const art_artist = FormatArtist(info);
  const [artistIcon, setArtistIcon] = useState("");
  const [artistSign, setArtistSign] = useState("");

  // state for controlling the fav icon based on Firestore
  const [status, setStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(likes));
  const [iconLoading, setIconLoading] = useState(false);

  const tapToLike = (art) => {
    const storage = getStorage();
    const artRef = ref(storage, `arts/${art}`);

    getMetadata(artRef).then((res) => {
      const likes = parseInt(res["customMetadata"]["likes"]);

      const metadata = {
        customMetadata: {
          likes: status ? likes - 1 : likes + 1,
        },
      };

      updateMetadata(artRef, metadata);
    });
  };

  const getInfo = async () => {
    setIconLoading(true);
    const artistDocRef = doc(db, "user", id);
    const docSnap = await getDoc(artistDocRef);

    if (docSnap.exists()) {
      setArtistIcon(docSnap.data()["Info"]["icon"]);
      setArtistSign(docSnap.data()["Info"]["sign"]);
    } else {
      console.log("something wrong");
    }

    setIconLoading(false);
  };

  // things that required by logged in user but not accessible by guest.
  if (guest == false) {
    const docRef = doc(db, "user", userId);
    const docRef2 = doc(db, "user", id);

    useEffect(() => {
      setLikeCount(parseInt(likes));
      getInfo();

      // when user fav or unfav, doc will change
      // according to the Firestore.
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.data()["FavArt"].some((e) => e["artwork"] === url)) {
          setStatus(true);
        } else {
          setStatus(false);
        }
      });
      const unsubscribe2 = onSnapshot(docRef2, (doc) => {
        setArtistIcon(doc.data()["Info"]["icon"]);
      });

      return () => {
        unsubscribe();
        unsubscribe2();
      };

      // for the dependency array, it controls the fav
      // status shown in random function page.
    }, [url]);
  } else {
    useEffect(() => {
      getInfo();
    }, [url]);
  }

  return (
    <View style={[styles.artList, { marginLeft: left }]}>
      {/* fullscreen art */}
      <TouchableOpacity
        style={styles.arts}
        activeOpacity={0.8}
        onLongPress={() => {
          navigation.navigate("Full art", {
            name: art_name,
            artist: art_artist,
            imgUrl: url,
            fav: status,
            user: guest ? null : userId,
            artistId: id,
            onGoBack: (updatedStatus) => {
              setStatus(updatedStatus);
            },
          });
        }}
      >
        <Image source={{ uri: url }} style={{ flex: 1, width: width }} />
      </TouchableOpacity>
      <View style={[styles.artsInfo, { width: width }]}>
        {/* profile icon */}
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
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
            paddingLeft: 20,
          }}
        >
          {artistIcon === "" || iconLoading ? (
            <ActivityIndicator size="small" color="#483C32" />
          ) : (
            <Image
              source={{ uri: artistIcon }}
              style={{
                flex: 1,
                resizeMode: "cover",
                width: 50,
                borderRadius: 40,
              }}
            />
          )}
        </TouchableOpacity>
        {/* art info */}
        <View
          style={{
            flex: 8,
            paddingLeft: 20,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text style={styles.artName}>{art_name}</Text>
          <Text style={styles.artistName}>{art_artist}</Text>
        </View>
        <View style={{ marginRight: 16, marginVertical: 12, marginBottom: 16 }}>
          <Text style={styles.like}>{parseInt(likeCount)}</Text>
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => {
              const art = {
                artist: art_artist,
                artistId: id,
                artwork: url,
              };

              if (guest) {
                NotifyMessage("Sign in to use the Favourite function.");
              } else if (status) {
                setLikeCount((prev) => prev - 1);
                DelArt(userId, art);
              } else {
                setLikeCount((prev) => prev + 1);
                SaveArt(userId, art);
              }

              tapToLike(info);
            }}
          >
            {iconLoading ? (
              <ActivityIndicator size="small" color="#483C32" />
            ) : (
              <View>
                <Icon
                  name={status ? "heart" : "hearto"}
                  type="antdesign"
                  size={24}
                  color="#ff5152"
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  artList: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 0,
  },
  arts: {
    flex: 7,
  },
  artsInfo: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
  },
  artName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    overflow: "hidden",
  },
  artistName: {
    color: "white",
    fontSize: 14,
    overflow: "hidden",
  },
  favButton: {
    flex: 1,
    borderRadius: 30,
    justifyContent: "center",
  },
  like: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ff5152",
  },
});
