import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ArtItem from "../components/artItem";
import { Icon } from "@rneui/themed";
import { useTheme } from "../context/themeProvider";
import { UpdateContext } from "../context/updateArt";
import { sleep } from "../utils/tools";
import { useIsFocused } from "@react-navigation/native";

const randomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Random = ({ route }) => {
  const { colors } = useTheme();
  const { guest, user } = route.params;

  const { artList } = useContext(UpdateContext);
  const [random, setRandom] = useState(0);
  const { ranLoading, setRanLoading } = useContext(UpdateContext);

  const delay = async () => {
    setRandom(randomNumberInRange(0, artList.length - 1));
    await sleep(1000);
    setRanLoading(false);
  };

  useEffect(() => {
    delay();
  }, [artList.length]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.artContainer, { backgroundColor: colors.background }]}
      >
        {/* if artList is blank */}
        {(artList.length == 0 && (
          <View style={{ flex: 1, justifyContent: "center" }}>
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
          </View>
        )) ||
          // finished initializing
          (!ranLoading ? (
            <ArtItem
              user={user}
              guest={guest}
              url={artList[random]["art"]}
              id={artList[random]["artistId"]}
              index={random}
              likes={artList[random]["likes"]}
              info={artList[random]["name"]}
              width={undefined}
            />
          ) : (
            // initializing...
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#483C32" />
            </View>
          ))}
      </View>
      <TouchableOpacity
        style={[styles.refresh, , { backgroundColor: colors.background }]}
        onPress={() => {
          // randomly select an art from the artList
          setRandom(randomNumberInRange(0, artList.length - 1));
        }}
      >
        <Icon type="font-awesome" name="refresh" color={colors.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  artContainer: {
    flex: 1,
    marginTop: 80,
    marginBottom: 80,
    paddingHorizontal: 40,
  },
  refresh: {
    position: "absolute",
    alignSelf: "center",
    bottom: 30,
  },
});

export default Random;
