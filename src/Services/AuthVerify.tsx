import React, { useContext, useLayoutEffect } from 'react';
import User from '../Models/User';
import { UNSAFE_NavigationContext } from 'react-router-dom';
import { BrowserHistory } from 'history';

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

interface AuthVerifyProps {
  logOut(): void;
}

const AuthVerify = (props: AuthVerifyProps) => {
  const navigation = useContext(UNSAFE_NavigationContext).navigator as BrowserHistory;

  useLayoutEffect(() => {
    if (navigation) {
      navigation.listen(() => {
        const userJson = sessionStorage.getItem('user');

        if (userJson) {
          const user: User = JSON.parse(userJson);
          const decodedJwt = parseJwt(user.token);
          if (decodedJwt.exp * 1000 < Date.now()) {
            props.logOut();
          }
        }
      });
    }
  });

  return <div></div>;
};

export default AuthVerify;
