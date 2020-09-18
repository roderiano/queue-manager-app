import api from './api'
import User from '../models/user'

export class AuthenticationManager {
  
  async login(token) {
    // Set token for build header in request  
    localStorage.setItem("token", token);
    const response = await api.get("users/user_info/");
    
    // Save auth user
    let attr = response.data;
    let user = new User(attr.id, attr.username, attr.first_name, attr.last_name, attr.email, attr.is_superuser);
    localStorage.setItem("user", user.serialize());
  }

  logout() {
    localStorage.clear();
  }

  getToken = () => {
    return localStorage.getItem("token");
  }

  getUser = () => {
    let data = localStorage.getItem("user");
    let user = new User();
    user = user.deserialize(data);

    return user;
  }

  isAuthenticated = () => {
    return localStorage.getItem("token") !== null;
  }
  

}

export default AuthenticationManager;