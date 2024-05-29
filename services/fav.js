import {
  setDoc,
  doc,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

// create empty fav list when a user register
export const createEmptyFav = async (name, userId) => {
  await setDoc(doc(db, "user", userId), {
    FavArt: [],
    UploadedArt: [],
    Info: {
      name: name,
      sign: "Divided by nations, united by thoughts",
      icon: "https://firebasestorage.googleapis.com/v0/b/rn-demoapp2.appspot.com/o/userIcon%2Ficon_test.png?alt=media&token=9da12bc1-46ba-40a3-bb0a-cc0c81e6cabd",
    },
  });
};

// add to FavArt
export const SaveArt = async (userId, artUrl) => {
  const docRef = doc(db, "user", userId);

  await updateDoc(docRef, {
    FavArt: arrayUnion(artUrl),
  });
};

// delete from FavArt
export const DelArt = async (userId, artUrl) => {
  const docRef = doc(db, "user", userId);

  await updateDoc(docRef, {
    FavArt: arrayRemove(artUrl),
  });
};

export const UploadArtToFB = async (userId, artUrl) => {
  const docRef = doc(db, "user", userId);

  await updateDoc(docRef, {
    UploadedArt: arrayUnion(artUrl),
  });
};

export const EditSign = async (userId, sign) => {
  const docRef = doc(db, "user", userId);

  await updateDoc(docRef, {
    "Info.sign": sign,
  });
};

export const EditIcon = async (userId, iconUrl) => {
  const docRef = doc(db, "user", userId);

  await updateDoc(docRef, {
    "Info.icon": iconUrl,
  });
};
