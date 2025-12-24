/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import AxiosClient from "../axios-client";
import { data } from "react-router-dom";

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

  useEffect(() => {
    if (token) {
      AxiosClient.get("/user")
        .then(({ data }) => {
          setUser(data);
        })
        .catch(() => {
          setUser({});
          setToken(null);
        });
    }
  }, [token]);
  return (
    <stateContext.Provider value={{ user, token, setToken, setUser }}>
      {children}
    </stateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(stateContext);
