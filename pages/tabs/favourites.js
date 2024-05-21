import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import FavItem from "../../components/favItem";
import { auth, db } from "../../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { useTheme } from "../../theme/themeProvider";

const Favourites = () => {
  const { colors } = useTheme();

  const [favList, setFavList] = useState([]);
  const isGuest = auth.currentUser.isAnonymous;

  if (!isGuest) {
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
      <View style={[styles.container]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.title }]}>
            My Favourites ❤
          </Text>
        </View>
        <View style={styles.artContent}>
          <FlatList
            // when favList is empty
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.subTitle, { color: colors.title }]}>
                  No favourited art yet
                </Text>
                <Text style={{ color: colors.subtitle }}>
                  Too many choices? Try out the Random function!
                </Text>
              </View>
            }
            contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
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
  }
  // guest mode
  else {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.artContent,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={[styles.subTitle, { color: colors.title }]}>Opps!</Text>
          <Text style={{ color: colors.subtitle }}>
            Sign in to use the Favourites function.
          </Text>
        </View>
      </View>
    );
  }
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
  subTitle: {
    fontWeight: "bold",
    fontSize: 30,
    paddingBottom: 10,
  },
});
