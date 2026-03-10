import { useAuthState } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { login, register, logout, getCurrentUser } from "../api/auth.api"

export function useAuth() {
    const { user, setUser, loading, setLoading } = useAuthState();
    const navigate = useNavigate();

    async function handleLogin(email, password) {
        try {
            setLoading(true);
            const response = await login(email, password);
            setUser(response.user);
            navigate("/");
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong";
            return message;
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(email, password, username) {
        try {
            setLoading(true);
            const response = await register(email, password, username);
            setUser(response.user);
            navigate("/");
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong";
            return message;
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        try {
            setLoading(true);
            await logout();
            setUser(null);
            navigate("/login");
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong";
            return message;
        } finally {
            setLoading(false);
        }
    }

    async function handleGetCurrentUser() {
        try {
            setLoading(true);
            const response = await getCurrentUser();
            setUser(response.user);
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong";
            return message;
        } finally {
            setLoading(false);
        }
    }

    return {
        user,
        loading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGetCurrentUser
    }
}