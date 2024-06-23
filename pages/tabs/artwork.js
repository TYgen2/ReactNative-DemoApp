import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { React, useContext, useEffect, useRef, useState } from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  listAll,
  getMetadata,
  getBytes,
  list,
} from "firebase/storage";
import { FlatList } from "react-native-gesture-handler";
import ArtItem from "../../components/artItem";
import { useTheme } from "../../context/themeProvider";
import { GetHeaderHeight, sleep } from "../../utils/tools";
import { UpdateContext } from "../../context/updateArt";
import { auth } from "../../firebaseConfig";

const storage = getStorage();
const artRefs = ref(storage, "arts/");

const Artwork = ({ route }) => {
  const { colors } = useTheme();
  const { user } = route.params;
  const [isGuest, setGuest] = useState(auth.currentUser.isAnonymous);

  const [isLoading, setIsLoading] = useState(true);
  const { artList, setArtList } = useContext(UpdateContext);

  const flatlistRef = useRef();
  const toTop = () => {
    flatlistRef.current.scrollToIndex({ animated: true, index: 0 });
  };

  const fetchArtList = async () => {
    let artData = [];

    listAll(artRefs).then((res) => {
      const promises = res.items.map((itemRef) => {
        return Promise.all([
          getDownloadURL(itemRef),
          getMetadata(itemRef),
        ]).then(([url, metadata]) => {
          artData.push({
            name: itemRef.name,
            art: url,
            uploadDate: new Date(metadata["timeCreated"]),
            artistId: metadata["customMetadata"]["userId"],
            likes: metadata["customMetadata"]["likes"],
          });
        });
      });

      Promise.all(promises).then(() => {
        const sortedArtList = artData.sort(
          (a, b) => b.uploadDate.getTime() - a.uploadDate.getTime()
        );
        setArtList(sortedArtList);
        setIsLoading(false);
      });
    });
  };

  const renderItem = ({ item, index }) => (
    <ArtItem
      user={user}
      guest={isGuest}
      url={item["art"]}
      info={item["name"]}
      id={item["artistId"]}
      index={index}
      width={300}
      left={20}
    />
  );

  useEffect(() => {
    if (artList.length == 0) {
      fetchArtList();
    } else {
      toTop();
    }
  }, [artList.length]);

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
          ref={flatlistRef}
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
