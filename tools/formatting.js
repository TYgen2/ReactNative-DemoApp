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
