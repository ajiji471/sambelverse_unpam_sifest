import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(""); // Menyimpan ID pengguna

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const id = localStorage.getItem("userId"); // Mengambil ID pengguna dari localStorage
    if (token && id) {
      setIsLoggedIn(true);
      setUserId(id);
    }
  }, []);

  const login = (token, id) => {
    setIsLoggedIn(true);
    setUserId(id); // Menyimpan ID pengguna setelah login
    localStorage.setItem("authToken", token); // Simpan token ke localStorage
    localStorage.setItem("userId", id); // Simpan ID pengguna ke localStorage
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserId(""); // Reset ID pengguna
    localStorage.removeItem("authToken"); // Hapus token dari localStorage
    localStorage.removeItem("userId"); // Hapus ID pengguna dari localStorage
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
