  import fs from 'fs';
  import path from 'path';
  import { fileURLToPath } from 'url';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  console.log('🚀 Создаем AuthContext.jsx...');

  const authContextPath = path.join(__dirname, 'src', 'contexts', 'AuthContext.jsx');

  const authContextContent = `import React, { createContext, useContext, useState, useEffect } from 'react';

  const AuthContext = createContext();

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };

  const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8001');

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Пытаемся получить текущего пользователя с сервера по cookie
      const fetchMe = async () => {
        try {
          const res = await fetch(\`\${API_URL}/api/me\`, { credentials: 'include' });
          const data = await res.json();
          if (res.ok && data?.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } catch {
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMe();
    }, []);

    const login = async (email, password) => {
      try {
        const res = await fetch(\`\${API_URL}/api/auth/login\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok && data?.user) {
          setUser(data.user);
          return { success: true };
        }
        return { success: false, error: data?.error || 'Ошибка входа' };
      } catch (error) {
        return { success: false, error: 'Ошибка при входе в систему' };
      }
    };

    const register = async (name, email, password, phone) => {
      try {
        const res = await fetch(\`\${API_URL}/api/auth/register\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name, email, password, phone })
        });
        const data = await res.json();
        if (res.ok && data?.user) {
          setUser(data.user);
          return { success: true };
        }
        return { success: false, error: data?.error || 'Ошибка регистрации' };
      } catch (error) {
        return { success: false, error: 'Ошибка при регистрации' };
      }
    };

    const logout = async () => {
      try {
        await fetch(\`\${API_URL}/api/auth/logout\`, { method: 'POST', credentials: 'include' });
      } catch { }
      setUser(null);
      localStorage.removeItem('cart');
      localStorage.removeItem('repeat_order');
    };

    const value = {
      user,
      login,
      register,
      logout,
      isLoading
    };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };`;

  // Создаем папку contexts если её нет
  const contextsDir = path.dirname(authContextPath);
  if (!fs.existsSync(contextsDir)) {
    fs.mkdirSync(contextsDir, { recursive: true });
    console.log('✅ Создана папка contexts');
  }

  // Записываем файл
  fs.writeFileSync(authContextPath, authContextContent);
  console.log('✅ AuthContext.jsx создан!');
  console.log('📁 Файл создан по пути:', authContextPath);