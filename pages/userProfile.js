import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import UploadItem from "../components/uploadItem";
import { useTheme } from "../context/themeProvider";
import { Icon } from "@rneui/themed";
import Dialog from "react-native-dialog";
import DialogInput from "react-native-dialog/lib/Input";
import { EditIcon, EditSign } from "../services/fav";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { sleep } from "../utils/tools";

const storage = getStorage();

const UserProfile = ({ route }) => {
  const { colors } = useTheme();

  const { id, name, sign, icon } = route.params;
  const [artList, setArtlist] = useState([]);
  const [newSign, setNewSign] = useState(sign);
  const [tempSign, setTempSign] = useState(sign);
  const [showIcon, setShowIcon] = useState(icon);
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);

  const userId = auth.currentUser.uid;
  const isGuest = auth.currentUser.isAnonymous;
  const docRef = doc(db, "user", id);

  const delay = async () => {
    // buffer loading
    await sleep(5000);
    setIsListLoading(false);
  };

  useEffect(() => {
    delay();
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setArtlist(doc.data()["UploadedArt"]);
    });
    return () => unsubscribe();
  }, []);

  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = async () => {
    setVisible(false);
    await sleep(1000);
    setTempSign(newSign);
  };

  const handleConfirm = () => {
    EditSign(userId, tempSign);
    setNewSign(tempSign);
    setVisible(false);
  };

  const changeIcon = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!res.canceled) {
      setIsLoading(true);
      const { uri } = await FileSystem.getInfoAsync(res.assets[0].uri);

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed."));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = userId + ".jpg";
      const artRefs = ref(storage, "userIcon/" + filename);

      await uploadBytes(artRefs, blob).then((snapshot) => {
        getDownloadURL(artRefs).then((url) => {
          EditIcon(userId, url);
          setShowIcon(url);
        });
      });

      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <UploadItem
      imgUrl={item}
      artistId={id}
      guest={isGuest}
      user={userId}
      target={id}
      artist={name}
      icon={showIcon}
    />
  );

  return (
    <View style={styles.Container}>
      <View
        style={[
          styles.infoContainer,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.icon,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.profileIcon}
          onPress={changeIcon}
          disabled={userId === id ? false : true}
        >
          {isLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#483C32" />
            </View>
          ) : (
            <Image
              source={{ uri: showIcon }}
              style={{ flex: 1, width: 180, borderRadius: 100 }}
            />
          )}
        </TouchableOpacity>
        <Text style={[styles.artist, { color: colors.title }]}>{name}</Text>
        <TouchableOpacity
          style={[styles.signContainer, { backgroundColor: colors.icon }]}
          onPress={showDialog}
          disabled={userId === id ? false : true}
        >
          <Dialog.Container visible={visible} onBackdropPress={handleCancel}>
            <Dialog.Title>Edit your personal signature</Dialog.Title>
            <DialogInput
              value={newSign == tempSign ? newSign : tempSign}
              placeholder="write something..."
              onChangeText={(text) => setTempSign(text)}
              style={{ color: "black" }}
            />
            <Dialog.Button label="Cancel" onPress={async () => handleCancel} />
            <Dialog.Button label="Confirm" onPress={handleConfirm} />
          </Dialog.Container>
          <Icon
            name="signature"
            type="font-awesome-5"
            color={colors.invertedText}
            size={14}
          />
          <Text style={[styles.signature, { color: colors.invertedText }]}>
            {` : ${newSign}`}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={[styles.artContainer, { backgroundColor: colors.background }]}
      >
        <FlatList
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isListLoading ? (
                <ActivityIndicator size="large" color="#483C32" />
              ) : (
                <Text style={[styles.empty, { color: colors.title }]}>
                  This user hasn't post any art
                </Text>
              )}
            </View>
          }
          columnWrapperStyle={{
            justifyContent: "flex-start",
          }}
          contentContainerStyle={{ flexGrow: 1 }}
          overScrollMode="never"
          horizontal={false}
          data={artList}
          numColumns={3}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 3,
  },
  artContainer: {
    flex: 1.5,
  },
  profileIcon: {
    width: 180,
    height: 180,
    borderRadius: 100,
  },
  artist: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
  },
  signContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  signature: {
    fontSize: 14,
    fontStyle: "italic",
  },
  empty: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
