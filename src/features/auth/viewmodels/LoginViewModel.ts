import { useState } from 'react';
import { AuthService } from '../../../core/auth/AuthService';

export interface LoginViewModelProps {
    onLoginSuccess: () => void;
}

export const useLoginViewModel = (authService: AuthService, props: LoginViewModelProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            setError('Please enter username and password');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await authService.login(username, password);

            if (result.success) {
                props.onLoginSuccess();
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => setError('');

    return {
        username,
        setUsername,
        password,
        setPassword,
        isLoading,
        error,
        handleLogin,
        clearError,
    };
};

