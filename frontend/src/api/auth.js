import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/auth';

export const registerUser = async (userData) => {
    //Maps to our registrationController backend endpoint 
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    //Maps to loginController backend endpoint
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
};