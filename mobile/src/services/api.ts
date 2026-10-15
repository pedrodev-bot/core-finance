import axios from 'axios';

// Instância centralizada do Axios para comunicar com o Python
const api = axios.create({
    baseURL: 'http://192.168.1.104:8000',
    timeout: 5000, 
});

export default api;