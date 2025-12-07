import axios from 'axios';


const API_URL = 'http://localhost:5000/api/auth';

const signup = async (firstname, lastname, email, password) => {

  const response = await axios.post(`${API_URL}/signup`, { firstname, lastname, email, password });
  return response.data;


};

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem('userId', response.data.userId);
  localStorage.setItem('token', response.data.token);
  console.log("Response from authService:", response);
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'
  return true;
}






const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 500) {
      // Token expired or invalid
      localStorage.removeItem('token');
      alert("Your session has been expired! Please login");
      window.location.href = '/login'; // Redirect to login page
    }
    throw error;

  }
};




const updateUser =  async (userData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/update`, userData, config);
  return response.data;
}


const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  return true;
};



const authFunctions = { signup, login, getCurrentUser, logout, isAuthenticated, updateUser }

export default authFunctions;
