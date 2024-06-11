import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { handleGoogleLogin, signInAnon } from "../../services/auth";
import { useNavigation } from "@react-navigation/native";
import { auth, functions } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  getAdditionalUserInfo,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { createEmptyFav } from "../../services/fav";

const windowWidth = Dimensions.get("window").width;

WebBrowser.maybeCompleteAuthSession();

const IntroPage = () => {
  const navigation = useNavigation();

  // const getDocData = httpsCallable(functions, "getDocData");
  // const authUserAdmin = httpsCallable(functions, "authUserAdmin");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "511251591516-mkd7jqcjm3qtidg6thfjvgori9bk9p80.apps.googleusercontent.com",
    webClientId:
      "511251591516-t4a7oo1opra78gh46uo0p6tpv2fcb4ee.apps.googleusercontent.com",
  });

  // Google sign in
  useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((res) => {
          // console.log("GOOGLE LOGIN SUCCESS!: ", JSON.stringify(res, null, 2));
          const moreInfo = getAdditionalUserInfo(res);
          const { displayName, uid } = res.user;

          if (moreInfo.isNewUser) {
            createEmptyFav(displayName, uid);
            navigation.navigate("Change name", {
              provider: "Google",
              user: uid,
            });
          }
        })
        .catch((e) => console.log(e));
    }
  }, [response]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Inside" }],
        });

        // const jwtoken = await user.getIdToken();

        // authUserAdmin({ idToken: jwtoken })
        //   .then((res) => {
        //     console.log(res);
        //     getDocData({ docId: res.data["uid"] }).then((res2) =>
        //       console.log(res2.data["Info"])
        //     );
        //   })
        //   .catch((e) => console.error(e, "You are not an authenticated user"));
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
        {/* title */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>🖼ARTppreciate🖼</Text>
          <Text style={styles.subTitle}>
            Just some random art found on the Internet.{"\n"}I do not own any of
            them
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          {/* sign in */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#000" }]}
            onPress={() => navigation.navigate("Sign in")}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Sign in</Text>
          </TouchableOpacity>
          {/* sign up */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#000" }]}
            onPress={() => navigation.navigate("Sign up")}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Register</Text>
          </TouchableOpacity>
          {/* guest */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "grey" }]}
            onPress={() => signInAnon()}
          >
            <Text style={[styles.buttonText, { color: "#000" }]}>
              Visit as a guest
            </Text>
          </TouchableOpacity>
          <View style={styles.SMLogin}>
            <TouchableOpacity
              style={styles.SMIcon}
              onPress={() => console.log("wtf")}
            >
              <Image
                source={require("../../assets/facebook.png")}
                style={{ flex: 1, width: 50, borderRadius: 50 }}
              />
            </TouchableOpacity>
            {/* Google sign in */}
            <TouchableOpacity
              style={styles.SMIcon}
              onPress={() => promptAsync()}
            >
              <Image
                source={require("../../assets/google.png")}
                style={{ flex: 1, width: 50, borderRadius: 50 }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.SMIcon}>
              <Image
                source={require("../../assets/twitter.png")}
                style={{ flex: 1, width: 50, borderRadius: 50 }}
              />
            </TouchableOpacity>
          </View>
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
    top: -40,
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
  SMLogin: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    width: 260,
  },
  SMIcon: {
    elevation: 4,
    width: 50,
    height: 50,
    marginHorizontal: 20,
    borderRadius: 50,
  },
});
