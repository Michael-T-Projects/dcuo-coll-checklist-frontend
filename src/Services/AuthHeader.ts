import AuthorizationHeader from '../Models/AuthorizationHeader';

export default function authHeader(): AuthorizationHeader | null {
  const userJson = sessionStorage.getItem('user');

  if (!userJson) {
    return null;
  }

  return {
    Authorization: 'Bearer ' + JSON.parse(userJson).token,
  };
}
