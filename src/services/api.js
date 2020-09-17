import axios from 'axios';
import { AuthenticationManager } from "./auth";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/'
});

api.interceptors.request.use(async config => {
    let authManager = new AuthenticationManager();
    const token = authManager.getToken();
    
    if (token) {
      config.headers.Authorization = `Token  ${token}`;
    }
    
    return config;
});
  

export default api;