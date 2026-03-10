import axios from "axios"
import BASE_URL from "../utils/config"

const api = axios.create({
    baseURL: BASE_URL + "/api/user",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

export async function login(email, password) {
    const response = await api.post('/login', {
        email, password
    })
    return response.data;
}

export async function register(email, password, username) {
    const response = await api.post('/register', {
        email, password, name: username
    })
    return response.data;
}

export async function logout() {
    const response = await api.post('/logout')
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get('/profile')
    return response.data;
}