import axios from 'axios';

const USER_BASE_REST_API_URL = 'http://localhost:8083/api/users';

class UserService {
    // Enregistrement d'un nouvel utilisateur
    registerUser(user) {
        return axios.post(`${USER_BASE_REST_API_URL}/register`, user);
    }
    
    // Connexion de l'utilisateur
    loginUser(username, password) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        
        return axios.post(`${USER_BASE_REST_API_URL}/login`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
    }
    
    // Mot de passe oublié
    forgotPassword(email) {
        return axios.post(`${USER_BASE_REST_API_URL}/forgot-password`, { email });
    }
    
    // Réinitialisation du mot de passe
    resetPassword(resetData) {
        return axios.post(`${USER_BASE_REST_API_URL}/reset-password`, resetData);
    }
    
    // Mise à jour du profil utilisateur
    updateUser(userId, userData) {
        return axios.put(`${USER_BASE_REST_API_URL}/${userId}`, userData);
    }
    
    // Récupération de tous les utilisateurs (généralement pour l'admin)
    getAllUsers() {
        return axios.get(USER_BASE_REST_API_URL);
    }
}

export default UserService;