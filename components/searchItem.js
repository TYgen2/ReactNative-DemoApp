import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { FormatArtist, FormatName } from "../tools/formatting";
import { useTheme } from "../theme/themeProvider";

export default searchItem = ({ url, info }) => {
  const { colors } = useTheme();

  const art_name = FormatName(info);
  const art_artist = FormatArtist(info);

  return (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.artInfo}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.title }}>
          {art_name}
        </Text>
        <Text style={{ fontSize: 14, color: colors.subtitle }}>
          {art_artist}
        </Text>
      </View>
      <Image source={{ uri: url }} style={{ flex: 1.8 }} />
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
  },
  artInfo: {
    flex: 1,
    justifyContent: "center",
  },
});
