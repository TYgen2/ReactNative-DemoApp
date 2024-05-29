import { auth } from "../firebaseConfig";
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createEmptyFav } from "./fav";

export const handleLogin = async (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      console.log("Logged in with: ", user.email);
    })
    .catch((error) => alert(error.message));
};

export const handleSignUp = async (name, email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      const user = userCredentials.user;
      createEmptyFav(name, user.uid);
      console.log("Registered with: ", user.email);
    })
    .catch((error) => alert(error.message));
};

export const signInAnon = () => {
  signInAnonymously(auth)
    .then(() => {
      console.log("Signed in anonymously.");
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};

export const handleSignOut = async () => {
  signOut(auth)
    .then(() => {
      console.log("Signed out.");
    })
    .catch((error) => alert(error.message));
};
