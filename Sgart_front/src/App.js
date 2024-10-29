import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import RecuperarPwdForm from './components/RecuperarPwdForm';
import GoogleAuth from './components/GoogleAuth';
import GoogleAuthLogin from './components/GoogleAuthLogin';
import AdminAusenciasUI from './components/AdminAusenciasUI';
import UserValidationUI from './components/UserValidationUI';
import AdminWorkingHours from './components/AdminWorkingHours';
import UserOptions from './components/UserOptions';
import './App.css';

const App = () => {
  return (
    <div className="App"> {/* Contenedor general con estilos */}
      <Router>
        <Routes>
          {/* Rutas de autenticación */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/recover-password" element={<RecuperarPwdForm />} />
          
          {/* Rutas para Google Auth */}
          <Route path="/google-auth" element={<GoogleAuth />} />
          <Route path="/google-auth-login" element={<GoogleAuthLogin />} />

          {/* Ruta para el Dashboard del administrador */}
          <Route path="/admin-working-hours" element={<AdminWorkingHours />} />

          {/* Rutas para gestionar usuarios y ausencias */}
          <Route path="/user-options" element={<UserOptions />} />
          <Route path="/admin-ausencias" element={<AdminAusenciasUI />} />
          <Route path="/user-validation" element={<UserValidationUI />} />

        </Routes>
      </Router>
    </div>
  );
};

export default App;