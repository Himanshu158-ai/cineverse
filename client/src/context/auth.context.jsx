import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth.api";
import Loader from "../components/Loader";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await getCurrentUser();
                setUser(response.user);
            } catch (error) {
                console.log(error);
            } finally {
                setIsCheckingAuth(false);
            }
        }
        checkUser();
    }, []);

    if (isCheckingAuth) {
        return <Loader />
    }
    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthState = () => useContext(AuthContext);