import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// Components
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import ServiceOrders from "./components/ServiceOrders";
import Materials from "./components/Materials";
import Reports from "./components/Reports";
import Navigation from "./components/Navigation";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API}/login`, {
        username,
        password
      });

      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(userData);
      toast.success("Login realizado com sucesso!");
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.info("Logout realizado com sucesso!");
  };

  const register = async (userData) => {
    try {
      await axios.post(`${API}/register`, userData);
      toast.success("Usuário registrado com sucesso!");
      return true;
    } catch (error) {
      console.error('Register error:', error);
      toast.error("Erro ao registrar usuário.");
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <BrowserRouter>
          {user ? (
            <div className="flex h-screen">
              <Navigation />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/service-orders" element={<ServiceOrders />} />
                  <Route path="/materials" element={<Materials />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          ) : (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </BrowserRouter>
        <Toaster position="top-right" />
      </div>
    </AuthContext.Provider>
  );
}

export default App;