import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Login } from './Pages/Login/Login';
import { Signup } from './Pages/Signup/Signup';
import './index.css';
import AuthVerify from './Services/AuthVerify';
import AuthService from './Services/AuthService';
import User from './Models/User';
import { Landing } from './Pages/Landing/Landing';

const logOut = () => {
  AuthService.logout();
  window.location.href = '/login';
};

const Wrapper = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      AuthService.authMe()
        .then(({ data }: any) => {
          data.token = currentUser.token;
          setUser(data);
          sessionStorage.setItem('user', JSON.stringify(data));
        })
        .then(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return isLoading ? (
    <></>
  ) : (
    <>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<Landing />} />
        </Route>
        <Route path="login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="signup" element={user ? <Navigate to="/" /> : <Signup />} />
      </Routes>
      <AuthVerify logOut={logOut} />
    </>
  );
};

ReactDOM.render(
  <BrowserRouter>
    <Wrapper />
  </BrowserRouter>,
  document.getElementById('root'),
);
