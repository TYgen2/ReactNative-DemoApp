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
import { React, useState, useEffect, useContext } from "react";
import { FormatName, FormatArtist, NotifyMessage } from "../utils/tools";
import { db } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { getMetadata, getStorage, ref, updateMetadata } from "firebase/storage";
import { UpdateContext } from "../context/updateArt";

const artItem = ({ user, guest, url, info, id, index, width, left }) => {
  const navigation = useNavigation();
  const userId = guest ? null : user;

  const art_name = FormatName(info);
  const art_artist = FormatArtist(info);
  const [artistIcon, setArtistIcon] = useState("");
  const [artistSign, setArtistSign] = useState("");
  const { artList, setArtList } = useContext(UpdateContext);
  const idx = artList.map((e) => e.art).indexOf(url);

  // state for controlling the fav icon based on Firestore
  const [status, setStatus] = useState(false);
  const [iconLoading, setIconLoading] = useState(false);

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
          likes: status ? likes - 1 : likes + 1,
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
    const newLikesValue = status ? res - 1 : res + 1;
    const updatedList = updateLikes(index, newLikesValue);
    setArtList(updatedList);
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
  if (guest === false) {
    const docRef = doc(db, "user", userId);
    const docRef2 = doc(db, "user", id);

    useEffect(() => {
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
            idx: idx,
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
              user: userId,
              guest: guest,
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
          {iconLoading ? (
            <ActivityIndicator size="small" color="#483C32" />
          ) : (
            <Text style={styles.like}>{artList[index].likes}</Text>
          )}

          <TouchableOpacity
            style={styles.favButton}
            onPress={() => {
              const art = {
                artName: art_name,
                artist: art_artist,
                artistId: id,
                artwork: url,
              };

              if (guest) {
                NotifyMessage("Sign in to use the Favourite function.");
                return;
              } else if (status) {
                // faved, now unfav
                DelArt(userId, art);
              } else {
                // unfav, now fav
                SaveArt(userId, art);
              }

              handleLikeUpdate(index);
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

export default artItem;
