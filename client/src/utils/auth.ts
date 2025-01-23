import jwtDecode from 'jwt-decode';  // You may need to install this library (npm install jwt-decode)

class AuthService {
  // Method to get the decoded token (i.e., the user's profile)
  getProfile() {
    const token = this.getToken(); // Get the token from local storage
    if (token) {
      try {
        return jwtDecode(token);  // Decode the JWT token to access the payload (user data)
      } catch (error) {
        console.error('Failed to decode token', error);
        return null;
      }
    }
    return null;
  }

  // Method to check if the user is logged in (if a valid token exists in localStorage)
  loggedIn() {
    const token = this.getToken(); // Get the token from local storage
    if (token) {
      return !this.isTokenExpired(token); // Return false if the token is expired, otherwise true
    }
    return false; // If there is no token, the user is not logged in
  }
  
  // Method to check if the JWT token is expired
  isTokenExpired(token: string) {
    try {
      const decoded: JwtPayload = jwtDecode(token);  // Decode the token
      const expiry = decoded.exp as number;  // Extract the expiration time
      if (expiry < Date.now() / 1000) {  // Compare it to the current time (in seconds)
        return true;  // The token has expired
      }
      return false;  // The token is valid
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;  // If decoding fails, treat it as expired
    }
  }

  // Method to retrieve the token from localStorage
  getToken(): string {
    return localStorage.getItem('token') || ''; // Return the stored token (or empty string if not found)
  }

  // Method to log in: Set the token to localStorage and redirect to the home page
  login(idToken: string) {
    localStorage.setItem('token', idToken);  // Store the token in local storage
    window.location.href = '/';  // Redirect to the home page (you may want to adjust this to match your app's flow)
  }

  // Method to log out: Remove the token from localStorage and redirect to the login page
  logout() {
    localStorage.removeItem('token');  // Remove the token from localStorage
    window.location.href = '/login';  // Redirect to the login page (adjust based on your app's structure)
  }
}

export default new AuthService();  // Create and export an instance of the AuthService class
