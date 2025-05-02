import axios from 'axios';
//URL DEL BACKEND
const API_URL = 'http://localhost:8000/api';


export const register = async (payload) => {
  return await axios.post(`${API_URL}/registro/`, payload);
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};