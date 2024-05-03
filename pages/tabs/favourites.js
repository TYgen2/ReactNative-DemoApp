import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import FavItem from "../../components/favItem";
import { auth, db } from "../../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

const Favourites = () => {
  const [favList, setFavList] = useState([]);
  const userId = auth.currentUser.uid;
  const docRef = doc(db, "user", userId);

  useEffect(() => {
    // when doc changes (user delete or add favourite to Firestore),
    // favList will be updated accordingly.
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setFavList(doc.data()["art"]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Favourites ❤</Text>
      </View>
      <View style={styles.artContent}>
        <FlatList
          contentContainerStyle={{ alignItems: "center" }}
          overScrollMode="never"
          horizontal={false}
          data={favList}
          numColumns={2}
          renderItem={({ item }) => {
            return <FavItem imgUrl={item} userId={userId} />;
          }}
        />
      </View>
    </View>
  );
};

export default Favourites;

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
