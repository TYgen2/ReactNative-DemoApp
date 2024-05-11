import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../theme/themeProvider";
import { Dropdown } from "react-native-element-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import SearchItem from "../components/searchItem";
import { Icon } from "@rneui/themed";
import {
  FormatArtist,
  FormatName,
  GetHeaderHeight,
  sleep,
} from "../utils/tools";
import { auth } from "../firebaseConfig";

const storage = getStorage();
const artRefs = ref(storage, "arts/");

const Search = () => {
  const { colors } = useTheme();

  const options = [
    { label: "By name", value: "1" },
    { label: "By artist", value: "2" },
  ];
  const [isGuest, setGuest] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(1);
  const [artList, setArtList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [serach, setSearch] = useState("");

  const getArtList = async () => {
    listAll(artRefs).then((res) => {
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef).then((url) => {
          setArtList((prev) => [...prev, { name: itemRef.name, art: url }]);
          setFiltered((prev) => [...prev, { name: itemRef.name, art: url }]);
        });
      });
    });
    await sleep(1000);
    setIsLoading(false);
  };

  const serachFilter = (text, mode) => {
    if (text) {
      const newData = artList.filter((art) => {
        const artName = FormatName(art.name);
        const artArtist = FormatArtist(art.name);

        const nameData = artName ? artName.toLowerCase() : "".toLowerCase();
        const artistData = artArtist
          ? artArtist.toLowerCase()
          : "".toLowerCase();
        const textData = text.toLowerCase();

        // mode for determine art filter search by name or artist
        // 1: name, 2: artist
        return mode == 1
          ? nameData.indexOf(textData) > -1
          : artistData.indexOf(textData) > -1;
      });
      setFiltered(newData);
      setSearch(text);
    } else {
      // default when no search text is typed
      setFiltered(artList);
      setSearch(text);
    }
  };

  useEffect(() => {
    setGuest(auth.currentUser.isAnonymous);

    if (artList.length == 0) {
      getArtList();
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.title,
          { backgroundColor: colors.background, marginTop: GetHeaderHeight() },
        ]}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: colors.title,
            fontSize: 24,
            paddingLeft: 16,
          }}
        >
          Search for an Artwork
        </Text>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 8,
            top: -16,
          }}
        >
          <Dropdown
            placeholderStyle={{ color: "#0096FF", fontSize: 14 }}
            selectedTextStyle={{ color: "#0096FF", fontSize: 14 }}
            containerStyle={{ borderRadius: 10 }}
            itemContainerStyle={{
              width: 90,
              alignSelf: "center",
            }}
            itemTextStyle={{
              fontSize: 14,
            }}
            data={options}
            labelField="label"
            valueField="value"
            placeholder="By name"
            value={value}
            onChange={(item) => {
              setValue(item.value);
            }}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBar]}>
        <Icon
          name="search"
          type="material"
          style={styles.searchIcon}
          color={colors.subtitle}
        />
        <TextInput
          autoCapitalize="none"
          style={styles.textInput}
          placeholder={value == "1" ? "e.g. chlorine " : "e.g. torino "}
          placeholderTextColor={colors.subtitle}
          fontWeight="bold"
          value={serach}
          onChangeText={(text) => serachFilter(text, value)}
        />
      </View>
      <View style={styles.searchContent}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            isLoading ? (
              <View
                style={{
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color="#483C32" />
              </View>
            ) : (
              <View
                style={{
                  flexGrow: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.noMatch, { color: colors.subtitle }]}>
                  No match found
                </Text>
              </View>
            )
          }
          data={filtered}
          overScrollMode="never"
          renderItem={({ item }) => {
            return (
              <SearchItem
                guest={isGuest}
                url={item["art"]}
                info={item["name"]}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "green",
  },
  searchBar: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  textInput: {
    paddingHorizontal: 10,
    fontSize: 16,
    paddingRight: 200,
  },
  searchContent: {
    flex: 18,
  },
  noMatch: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchIcon: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
  },
});

export default Search;
