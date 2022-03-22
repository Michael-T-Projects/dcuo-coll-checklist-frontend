import AuthorizationHeader from '../Models/AuthorizationHeader';

export default function authHeader(): AuthorizationHeader | null {
  const userJson = localStorage.getItem('user');

  if (!userJson) {
    return null;
  }

  return {
    Authorization: 'Bearer ' + JSON.parse(userJson).token,
  };
}
