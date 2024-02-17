import { jwtDecode } from 'jwt-decode';

class AuthService {
    getProfile() {
        return jwtDecode(this.getToken());
    }

    loggedIn() {
        const token = this.getToken();
        return token && !this.isTokenExpired(token) ? true : false;
    }

    isTokenExpired(token) {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
            localStorage.removeItem('id_token');
            localStorage.removeItem('userId');
            return true;
        }
        return false;
    }

    getToken() {
        return localStorage.getItem('id_token');
    }

    login(idToken) {
        localStorage.setItem('id_token', idToken);
    }

    logout() {
        localStorage.removeItem('id_token');
    }
}

const auth = new AuthService();

export default auth;