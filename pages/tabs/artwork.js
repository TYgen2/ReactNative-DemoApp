import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { React, useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";
import { FlatList } from "react-native-gesture-handler";
import ArtItem from "../../components/artItem";
import ArtModel from "../../models/artModel";
import { checkStatus } from "../../services/fav";
import { auth } from "../../firebaseConfig";

const storage = getStorage();
const artRefs = ref(storage, "arts/");

const Artwork = () => {
  const [artList, setArtList] = useState([]);
  const userId = auth.currentUser.uid;

  // get all arts from storage
  const getArtList = async () => {
    await listAll(artRefs).then((res) => {
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then(async (url) => {
          const res = await checkStatus(userId, url);
          let art = new ArtModel(itemRef.name, url, res);
          setArtList((prev) => [...prev, art]);
        });
      });
    });
    console.log("LOADED ARTS");
  };

  useEffect(() => {
    if (artList.length == 0) {
      getArtList();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Trending Arts 🔥</Text>
      </View>
      <View style={styles.artContent}>
        <FlatList
          contentContainerStyle={{ paddingEnd: 20 }}
          overScrollMode="never"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={artList}
          renderItem={({ item }) => {
            return (
              <ArtItem
                url={item["url"]}
                info={item["name"]}
                favStatus={item["isFav"]}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default Artwork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
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
