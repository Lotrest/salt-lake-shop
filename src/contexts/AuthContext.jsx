import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL, http } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // === Проверяем авторизацию при загрузке приложения ===
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await http('/api/auth/me'); // ✅ исправленный путь
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // === Авторизация ===
  const login = async (email, password) => {
    try {
      const data = await http('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.success && data.user) {
        setUser(data.user);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Ошибка входа' };
    }
  };

  // === Регистрация ===
  const register = async (name, email, password, phone) => {
    try {
      const data = await http('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
      });
      if (data.success && data.user) {
        setUser(data.user);
      }
      return data;
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message || 'Ошибка регистрации' };
    }
  };

  // === Выход ===
  const logout = async () => {
    try {
      await http('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('cart');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
