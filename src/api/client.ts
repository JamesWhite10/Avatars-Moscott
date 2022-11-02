import axios from 'axios';

export const API_URL = 'http://localhost:3000/';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
