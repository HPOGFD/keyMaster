// Importing specific types and functions from the 'jwt-decode' library.
// JwtPayload: A type definition representing the structure of a JSON Web Token payload.
// jwtDecode: A function used to decode a JSON Web Token (JWT) and extract its payload.
import { type JwtPayload, jwtDecode } from 'jwt-decode';
import type { UserData } from '../interfaces/UserData';

class AuthService {
  getProfile() {
    console.log('Getting user profile...');
    const token = this.getToken();
    if (token) {
      const decodedProfile = jwtDecode<UserData>(token);
      console.log('Decoded profile:', decodedProfile);
      return decodedProfile;
    } else {
      console.log('No token found, unable to decode profile');
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();
    const isLoggedIn = !!token && !this.isTokenExpired(token);
    console.log('User logged in:', isLoggedIn);
    return isLoggedIn;
  }

  isTokenExpired(token: string) {
    console.log('Checking if token is expired...');
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Decoded token:', decoded);
      // Check if the decoded token has an 'exp' (expiration) property and if it is less than the current time in seconds.
      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        console.log('Token is expired');
        return true;
      }
      console.log('Token is valid');
      return false;
    } catch (err) {
      // If decoding fails (e.g., due to an invalid token format), catch the error and return false.
      console.error('Error decoding token:', err);
      return false;
    }
  }

  getToken(): string {
    const loggedUser = localStorage.getItem('id_token') || '';
    console.log('Retrieved token from localStorage:', loggedUser);
    return loggedUser;
  }

  login(idToken: string) {
    console.log('Logging in with token:', idToken);
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    console.log('Logging out...');
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
