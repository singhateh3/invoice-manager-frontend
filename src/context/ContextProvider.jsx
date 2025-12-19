/* eslint-disable no-unused-vars */
import { createContext, useContext, useState } from "react";

const stateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));

  const setToken = (tokenValue) => {
    if (tokenValue) {
      _setToken(tokenValue);
      localStorage.setItem("ACCESS_TOKEN", tokenValue);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
      _setToken(null);
    }
  };
  return (
    <stateContext.Provider value={{ user, token, setToken, setUser }}>
      {children}
    </stateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(stateContext);
