import { useState, useEffect } from 'react';
import { AdminRepository } from '../repositories/AdminRepository';
import { ApiResult } from '../../../core/api/ApiResult';

export const useAdminViewModel = (adminRepository: AdminRepository) => {
    const [dashboardData, setDashboardData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadDashboard = async () => {
        setIsLoading(true);
        setError('');

        const result: ApiResult<any> = await adminRepository.getDashboard();

        if (result.type === 'Success') {
            setDashboardData(Array.isArray(result.data) ? result.data : [result.data]);
        } else {
            setError(result.message || 'Failed to load dashboard');
        }

        setIsLoading(false);
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const refresh = () => {
        loadDashboard();
    };

    return {
        dashboardData,
        isLoading,
        error,
        refresh,
    };
};

