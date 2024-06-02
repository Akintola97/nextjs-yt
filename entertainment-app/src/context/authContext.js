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
      if (response.data && response.data.username) {
        setUser(response.data.username);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
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
        <div className="w-full min-h-screen pt-[10vh] bg-gray-900 flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;