import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  try {
    // Make a POST request to the login route on the backend
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo), // Send user info (username and password)
    });

    // If the response is successful, return the JWT token
    if (response.ok) {
      const data = await response.json();
      const { token } = data; // Extract the token from the response
      
      // Store the JWT token securely in the local storage
      localStorage.setItem('token', token);

      return token; // Return the token for further use (if needed)
    } else {
      // Handle errors such as invalid credentials
      const data = await response.json();
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Re-throw the error for handling in the UI
  }
};

export { login };
