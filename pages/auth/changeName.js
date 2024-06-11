import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { handleGoogleLogin, handleLogin } from "../../services/auth";
import { LinearGradient } from "expo-linear-gradient";
import { EditName } from "../../services/fav";

const ChangeName = ({ route, navigation }) => {
  const [name, setName] = useState("");
  const [isNameInputFocused, setNameInputFocused] = useState(false);
  const { provider, user } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.loginMethod}>
        <LinearGradient
          colors={["#e54335", "#f6b705", "#35a354", "#4281ef"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.innerContainer}>
            <Text style={styles.remind}>
              You are currently using{"\n"}Google to register
            </Text>
          </View>
        </LinearGradient>
        <Image
          source={require("../../assets/google_name.png")}
          style={styles.icon}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={name}
          placeholder="Name"
          style={[
            styles.input,
            {
              borderColor:
                isNameInputFocused == true ? "#967969" : "transparent",
              borderWidth: isNameInputFocused == true ? 2 : 0,
              fontWeight: name === "" ? "bold" : "normal",
            },
          ]}
          onChangeText={(text) => setName(text)}
          onFocus={() => setNameInputFocused(true)}
          onSubmitEditing={() => setNameInputFocused(false)}
          onEndEditing={() => setNameInputFocused(false)}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            EditName(user, name);
            navigation.pop(1);
          }}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ChangeName;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  loginMethod: {
    marginTop: 100,
    width: "100%",
    flex: 1,
  },
  innerContainer: {
    borderRadius: 20,
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  gradient: {
    borderRadius: 20,
    marginHorizontal: 40,
    flex: 0.5,
  },
  remind: {
    fontSize: 30,
    fontFamily: "Caveat-VariableFont_wght",
    textAlign: "center",
    textAlignVertical: "center",
  },
  icon: {
    flex: 1,
    resizeMode: "contain",
    width: 250,
    height: 250,
    alignSelf: "center",
  },
  inputContainer: {
    width: "100%",
    flex: 1,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 4,
    margin: 6,
    marginHorizontal: 40,
  },
  buttonContainer: {
    width: 90,
    marginTop: 25,
    borderRadius: 50,
    padding: 10,
    backgroundColor: "#C4A484",
    alignSelf: "center",
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 2,
  },
});
