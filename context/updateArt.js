import React, { createContext, useState } from "react";

export const UpdateContext = createContext();

export const ArtContextProvider = ({ children }) => {
  const [length, setLength] = useState(0);
  const [artList, setArtList] = useState([]);

  return (
    <UpdateContext.Provider value={{ length, setLength, artList, setArtList }}>
      {children}
    </UpdateContext.Provider>
  );
};
