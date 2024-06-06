import React, { createContext, useState } from "react";

export const UpdateContext = createContext();

export const ArtContextProvider = ({ children }) => {
  const [length, setLength] = useState(0);
  const [artList, setArtList] = useState([]);
  const [token, setToken] = useState("");

  return (
    <UpdateContext.Provider
      value={{
        length,
        setLength,
        artList,
        setArtList,
        token,
        setToken,
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
};
