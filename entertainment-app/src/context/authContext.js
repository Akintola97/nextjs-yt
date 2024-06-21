"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/user");
      setUser(response.data.user.username);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, fetchData }}>
      {!loading ? (
        children
      ) : (
        null
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;