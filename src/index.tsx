import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './Pages/Login/Login';
import { Signup } from './Pages/Signup/Signup';
import './index.css';
import AuthVerify from './Services/AuthVerify';
import AuthService from './Services/AuthService';

const logOut = () => {
  AuthService.logout();
  window.location.href = '/login';
};

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
    </Routes>
    <AuthVerify logOut={logOut} />
  </BrowserRouter>,
  document.getElementById('root'),
);
