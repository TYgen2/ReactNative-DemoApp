import {
  setDoc,
  doc,
  arrayUnion,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import Toast from "react-native-toast-message";

// create empty fav list when a user register
export const createEmptyFav = async (userId) => {
  await setDoc(doc(db, "user", userId), {
    art: [],
  });
};

// add to fav
export const saveArt = async (userId, artUrl) => {
  const docRef = doc(db, "user", userId);

  await updateDoc(docRef, {
    art: arrayUnion(artUrl),
  });

  // Toast.show({
  //   type: "success",
  //   text1: "Successfully added to favourites!",
  //   position: "bottom",
  //   visibilityTime: 3000,
  // });
};

// delete fav
export const delArt = async (userId, artUrl) => {
  const docRef = doc(db, "user", userId);

  await updateDoc(docRef, {
    art: arrayRemove(artUrl),
  });
};
