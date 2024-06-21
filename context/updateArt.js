import React, { createContext, useState } from "react";

export const UpdateContext = createContext();

export const ArtContextProvider = ({ children }) => {
  const [length, setLength] = useState(0);
  const [artList, setArtList] = useState([]);
  const [favList, setFavList] = useState([]);
  const [token, setToken] = useState("");
  const [ranLoading, setRanLoading] = useState(true);

  return (
    <UpdateContext.Provider
      value={{
        length,
        setLength,
        artList,
        setArtList,
        token,
        setToken,
        favList,
        setFavList,
        ranLoading,
        setRanLoading,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};
