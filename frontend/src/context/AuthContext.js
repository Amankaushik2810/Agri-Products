import React, { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      const decoded = jwtDecode(token);
      localStorage.setItem('userId', decoded.userId); // store for chat
      return {
        token,
        role: decoded.role,
        email: decoded.email,
        userId: decoded.userId
      };
    }
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return null;
  });

  const login = (token, rememberMe, navigate) => {
    const decoded = jwtDecode(token);
    const newUser = {
      token,
      role: decoded.role,
      email: decoded.email,
      userId: decoded.userId,
    };
    setUser(newUser);
    localStorage.setItem('userId', decoded.userId);
    if (rememberMe) {
      localStorage.setItem('token', token);
    }
    if (navigate) {
      navigate(decoded.role === 'Admin' ? '/admin' : '/user');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const token = user?.token || null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
