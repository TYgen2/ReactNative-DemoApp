import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { signInAnon } from "../../services/auth";
import { useNavigation, StackActions } from "@react-navigation/native";
import { auth } from "../../firebaseConfig";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

const windowWidth = Dimensions.get("window").width;

const IntroPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Inside" }],
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.bgImgContainer}>
        <Image
          source={require("../../assets/chiori.jpg")}
          style={[styles.bgImage, { width: windowWidth }]}
        />
      </View>
      <View style={styles.bgContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>🖼ARTppreciate🖼</Text>
          <Text style={styles.subTitle}>
            Just some random art found on the Internet.{"\n"}I do not own any of
            them
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#000" }]}
            onPress={() => navigation.navigate("Sign in")}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#000" }]}
            onPress={() => navigation.navigate("Sign up")}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "grey" }]}
            onPress={() => signInAnon()}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>
              Visit as a guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default IntroPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bgImgContainer: {
    flex: 4,
  },
  bgImage: {
    height: 600,
    resizeMode: "cover",
    top: -10,
    opacity: 0.5,
  },
  bgContainer: {
    flex: 6,
    backgroundColor: "#fff",
  },
  textContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
    paddingVertical: 10,
  },
  subTitle: {
    textAlign: "center",
    fontSize: 12,
    color: "grey",
  },
  buttonContainer: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
    top: -60,
  },
  button: {
    width: 260,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 30,
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
