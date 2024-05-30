import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { React, useContext, useEffect, useState, memo } from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  listAll,
  getMetadata,
} from "firebase/storage";
import { FlatList } from "react-native-gesture-handler";
import ArtItem from "../../components/artItem";
import { auth, db } from "../../firebaseConfig";
import { useTheme } from "../../context/themeProvider";
import { GetHeaderHeight, sleep } from "../../utils/tools";
import { UpdateContext } from "../../context/updateArt";
import { doc, getDoc } from "firebase/firestore";

const storage = getStorage();
const artRefs = ref(storage, "arts/");

const Artwork = () => {
  const { colors } = useTheme();

  const [isGuest, setGuest] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { artList, setArtList } = useContext(UpdateContext);
  const { userIcon, setUserIcon } = useContext(UpdateContext);

  const userId = auth.currentUser.uid;
  const docRef = doc(db, "user", userId);

  const getUserIcon = async () => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserIcon(docSnap.data()["Info"]["icon"]);
      console.log(userIcon);
    } else {
      console.log("No such document!");
    }
  };

  // fetch all arts from storage
  const fetchArtList = async () => {
    listAll(artRefs).then((res) => {
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          getMetadata(itemRef).then((metadata) => {
            setArtList((prev) => [
              ...prev,
              {
                name: itemRef.name,
                art: url,
                artistId: metadata["customMetadata"]["userId"],
              },
            ]);
          });
        });
      });
    });

    // buffer loading
    await sleep(1000);
    setIsLoading(false);
  };

  const renderItem = ({ item }) => (
    <ArtItem
      guest={isGuest}
      url={item["art"]}
      info={item["name"]}
      id={item["artistId"]}
      width={300}
      left={20}
    />
  );

  useEffect(() => {
    setGuest(auth.currentUser.isAnonymous);
    fetchArtList();

    if (isGuest == false) {
      getUserIcon();
    }
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, marginTop: GetHeaderHeight() },
      ]}
    >
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.title }]}>
          Recent Arts 🔥
        </Text>
      </View>
      <View style={styles.artContent}>
        <FlatList
          ListEmptyComponent={
            <View
              style={{
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#483C32" />
              ) : (
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 24,
                    color: colors.title,
                  }}
                >
                  No one post art yet...
                </Text>
              )}
            </View>
          }
          contentContainerStyle={{ paddingEnd: 20, flexGrow: 1 }}
          overScrollMode="never"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={artList}
          renderItem={renderItem}
          removeClippedSubviews={true}
          windowSize={10}
        />
      </View>
    </View>
  );
};

export default Artwork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 24,
  },
  artContent: {
    flex: 12,
    justifyContent: "center",
  },
});
