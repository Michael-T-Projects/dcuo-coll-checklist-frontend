import { AxiosRequestHeaders } from 'axios';

export default function authHeader(): AxiosRequestHeaders | undefined {
  const userJson = sessionStorage.getItem('user');

  if (!userJson) {
    return undefined;
  }

  return {
    Authorization: 'Bearer ' + JSON.parse(userJson).token,
  };
}
