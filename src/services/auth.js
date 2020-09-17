export class AuthenticationManager {

  constructor() {
    this.token_key = null;
  }
  
  login(token) {
    localStorage.setItem(this.token_key , token);
  }

  logout() {
    localStorage.clear();
  }

  getToken = () => {
    return localStorage.getItem(this.token_key);
  }

  isAuthenticated = () => {
    return localStorage.getItem(this.token_key) !== null;
  }
  

}

export default AuthenticationManager;