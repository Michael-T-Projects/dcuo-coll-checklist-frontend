import axios, { AxiosResponse } from 'axios';
import User from '../Models/User';
import authHeader from './AuthHeader';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://dcuo-coll-checklist-backend.herokuapp.com/api/v1'
    : 'http://localhost:8080/api/v1';

class AuthService {
  login(username: string, password: string): Promise<unknown> {
    return axios
      .post(API_URL + '/auth/authenticate', {
        username,
        password,
      })
      .then((response: AxiosResponse) => {
        if (response.data.token && response.data.username && response.data.email) {
          sessionStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout(): void {
    sessionStorage.removeItem('user');
  }

  register(username: string, email: string, password: string): Promise<unknown> {
    return axios.post(API_URL + '/auth/signup', {
      username,
      email,
      password,
    });
  }

  authMe(): Promise<unknown> {
    return axios.get(API_URL + '/auth/me', { headers: authHeader() });
  }

  getCurrentUser(): User | null {
    const userJson = sessionStorage.getItem('user');

    if (!userJson) {
      return null;
    }

    return JSON.parse(userJson);
  }
}

export default new AuthService();
