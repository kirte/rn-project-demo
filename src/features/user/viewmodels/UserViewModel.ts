import { useState, useEffect } from 'react';
import { UserRepository } from '../repositories/UserRepository';
import { ApiResult } from '../../../core/api/ApiResult';
import { User } from '../models/UserModel';

export const useUserViewModel = (userRepository: UserRepository) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadUser = async (userId: string = '1') => {
        setIsLoading(true);
        setError('');

        const result: ApiResult<User> = await userRepository.getUser(userId);

        if (result.type === 'Success') {
            setUser(result.data);
        } else {
            setError(result.message || 'Failed to load user');
        }

        setIsLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const refresh = () => {
        loadUser();
    };

    return {
        user,
        isLoading,
        error,
        refresh,
    };
};

