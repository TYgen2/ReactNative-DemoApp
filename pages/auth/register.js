import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { handleSignUp } from "../../services/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isNameInputFocused, setNameInputFocused] = useState(false);
  const [isEmailInputFocused, setEmailInputFocused] = useState(false);
  const [isPasswordInputFocused, setPasswordInputFocused] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={name}
          placeholder="Name (This will be your artist name)"
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
        <TextInput
          value={email}
          placeholder="Email"
          style={[
            styles.input,
            {
              borderColor:
                isEmailInputFocused == true ? "#967969" : "transparent",
              borderWidth: isEmailInputFocused == true ? 2 : 0,
              fontWeight: email === "" ? "bold" : "normal",
            },
          ]}
          onChangeText={(text) => setEmail(text)}
          onFocus={() => setEmailInputFocused(true)}
          onSubmitEditing={() => setEmailInputFocused(false)}
          onEndEditing={() => setEmailInputFocused(false)}
        />
        <TextInput
          value={password}
          placeholder="Password"
          style={[
            styles.input,
            {
              borderColor:
                isPasswordInputFocused == true ? "#967969" : "transparent",
              borderWidth: isPasswordInputFocused == true ? 2 : 0,
              fontWeight: password === "" ? "bold" : "normal",
            },
          ]}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          onFocus={() => setPasswordInputFocused(true)}
          onSubmitEditing={() => setPasswordInputFocused(false)}
          onEndEditing={() => setPasswordInputFocused(false)}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => handleSignUp(name, email, password)}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    marginTop: 100,
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
    marginTop: 12,
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
