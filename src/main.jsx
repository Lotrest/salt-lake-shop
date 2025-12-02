import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './i18n';
import { AuthProvider } from './contexts/AuthContext.jsx';  // ✅ добавили

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>   {/* ✅ теперь контекст авторизации доступен всему приложению */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
