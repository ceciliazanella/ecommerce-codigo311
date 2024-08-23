import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const storedSession = localStorage.getItem("session");
    return storedSession ? JSON.parse(storedSession) : null;
  });

  const loginUser = (credentials) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) =>
        u.email === credentials.email && u.contrasena === credentials.contrasena
    );

    if (user) {
      const sessionData = { email: user.email, nombre: user.nombre };
      setSession(sessionData);
      localStorage.setItem("session", JSON.stringify(sessionData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem("session");
  };

  const register = (credentials) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = {
      nombre: credentials.nombre || "",
      email: credentials.email || "",
      telefono: credentials.telefono || "",
      contrasena: credentials.contrasena || "",
    };

    const isEmailTaken = users.some((user) => user.email === newUser.email);
    const isUserExists = users.some(
      (user) => user.email === newUser.email && user.nombre === newUser.nombre
    );

    if (isUserExists) {
      return "Ya Existe una Cuenta con este mismo Nombre y/o Correo Electrónico...";
    }

    if (isEmailTaken) {
      return "Ya Existe una Cuenta con este mismo Correo Electrónico...";
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return null;
  };

  useEffect(() => {
    const storedSession = localStorage.getItem("session");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ session, loginUser, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
