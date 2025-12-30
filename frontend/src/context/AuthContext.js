import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, getUser, setAuthToken, setUser, logout as clearAuth } from '../utils/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: isAuthenticated(),
    user: getUser(),
  });

  useEffect(() => {
    // Check auth state on mount and when storage changes
    const checkAuth = () => {
      setAuthState({
        isAuthenticated: isAuthenticated(),
        user: getUser(),
      });
    };

    checkAuth();

    // Listen for storage changes (e.g., when login happens in another tab)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const login = (token, user) => {
    setAuthToken(token);
    setUser(user);
    setAuthState({
      isAuthenticated: true,
      user: user,
    });
  };

  const logout = () => {
    clearAuth();
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  const updateUser = (user) => {
    setUser(user);
    setAuthState((prev) => ({
      ...prev,
      user: user,
    }));
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

