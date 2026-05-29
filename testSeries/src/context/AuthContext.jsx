/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/users/profile');
      const userData = res.data;
      if (userData) {
        if (!userData._id && userData.id) userData._id = userData.id;
        if (!userData.id && userData._id) userData.id = userData._id;
        
        if (userData.plan && userData.plan.isActive) {
          localStorage.setItem(`userPlan_${userData._id}`, JSON.stringify(userData.plan));
        } else {
          localStorage.removeItem(`userPlan_${userData._id}`);
        }
      }
      setUser(userData);
    } catch (error) {
      console.error("Auth initialization failed:", error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.removeItem('userPlan'); // Clear legacy generic plan
    
    const normalizedUser = userData ? { ...userData } : null;
    if (normalizedUser) {
      if (!normalizedUser._id && normalizedUser.id) normalizedUser._id = normalizedUser.id;
      if (!normalizedUser.id && normalizedUser._id) normalizedUser.id = normalizedUser._id;
      
      if (normalizedUser.plan && normalizedUser.plan.isActive) {
        localStorage.setItem(`userPlan_${normalizedUser._id}`, JSON.stringify(normalizedUser.plan));
      } else {
        localStorage.removeItem(`userPlan_${normalizedUser._id}`);
      }
    }
    
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userPlan'); // Clear legacy generic plan
    if (user && user._id) {
      localStorage.removeItem(`userPlan_${user._id}`);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);