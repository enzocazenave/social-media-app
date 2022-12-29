import { createContext, useEffect, useState } from 'react';
import api from '../api/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [status, setStatus] = useState('checking');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        validateToken();
    }, []);

    const validateToken = async() => {
        try {
            const { data } = await api.get('/auth/renew');

            if (!data.ok) {
                window.localStorage.removeItem('@social_media:token');
                setUser({});
                setStatus('not-authenticated');
                return;
            };

            setUser(data);
            setStatus('authenticated');
        } catch(error) {
            window.localStorage.removeItem('@social_media:token');
            setUser({});
            setStatus('not-authenticated');
        }
    }
    
    return (
        <AuthContext.Provider
            value={{
                user,
                status,
                errorMessage,
                setUser,
                setStatus,
                setErrorMessage
            }}
        >
            { children }
        </AuthContext.Provider>
    );
}