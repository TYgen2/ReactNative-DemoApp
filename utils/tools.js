import { ToastAndroid, Platform, AlertIOS } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

export const FormatName = (str) => {
  if (str) {
    capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized.split("_")[0];
  }
};

export const FormatArtist = (str) => {
  if (str) {
    artist_name = str.split("_")[1];
    capitalized = artist_name.charAt(0).toUpperCase() + artist_name.slice(1);

    return capitalized.split(".")[0];
  }
};

export const notifyMessage = (msg) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    AlertIOS.alert(msg);
  }
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const getHeaderHeight = () => {
  return useHeaderHeight();
};
