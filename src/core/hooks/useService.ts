/**
 * Service Hooks for Dependency Injection
 * 
 * Provides React hooks to access services from the DI container.
 */

import { useEffect, useState, useMemo } from 'react';
import { container } from '../di/container';
import { ensureFeatureLoaded } from '../di/featureManager';

/**
 * useService Hook
 * 
 * Standard hook to get a service from the DI container.
 * Use this when the feature is already loaded (e.g., via navigation).
 * 
 * @param type - DI type symbol for the service
 * @returns The service instance
 * 
 * @example
 * const userRepo = useService<UserRepository>(UserTypes.UserRepository);
 */
export const useService = <T,>(type: symbol): T => {
    return useMemo(() => {
        if (!container) {
            throw new Error(
                'DI container is not initialized. ' +
                'Make sure reflect-metadata is imported first in index.js'
            );
        }

        if (!container.isBound(type)) {
            throw new Error(
                `Service type ${type.toString()} is not registered in the DI container. ` +
                `Make sure the feature's DI container is imported or use useFeatureService() for lazy loading.`
            );
        }

        return container.get<T>(type);
    }, [type]);
};

/**
 * State for useFeatureService hook
 */
interface UseFeatureServiceState<T> {
    service: T | null;
    isLoading: boolean;
    error: Error | null;
}

/**
 * useFeatureService Hook
 * 
 * Enhanced hook that automatically loads features on-demand before accessing their services.
 * Use this when calling APIs from features that might not be loaded yet.
 * 
 * NOW ACCEPTS ANY STRING - no hardcoded feature names!
 * 
 * @param featureName - Name of the feature to load (any string)
 * @param serviceType - DI type symbol for the service
 * @returns Object with service, isLoading, and error properties
 * 
 * @example
 * // Works with any registered feature!
 * const { service: userRepo, isLoading, error } = useFeatureService<UserRepository>(
 *   'user',
 *   UserTypes.UserRepository
 * );
 * 
 * // New features work automatically!
 * const { service: notificationService } = useFeatureService<NotificationService>(
 *   'notifications',
 *   NotificationTypes.NotificationService
 * );
 */
export function useFeatureService<T>(
    featureName: string, // Changed from FeatureName to string - now accepts any feature!
    serviceType: symbol
): UseFeatureServiceState<T> {
    const [state, setState] = useState<UseFeatureServiceState<T>>({
        service: null,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const loadService = async () => {
            try {
                // Ensure feature is loaded (works with any registered feature!)
                await ensureFeatureLoaded(featureName);

                if (!isMounted) return;

                // Check if service is bound
                if (!container.isBound(serviceType)) {
                    throw new Error(
                        `Service ${serviceType.toString()} not found in feature '${featureName}'. ` +
                        `Make sure the feature module registers this service.`
                    );
                }

                // Get service from container
                const service = container.get<T>(serviceType);

                if (isMounted) {
                    setState({
                        service,
                        isLoading: false,
                        error: null,
                    });
                }
            } catch (error) {
                if (isMounted) {
                    setState({
                        service: null,
                        isLoading: false,
                        error: error instanceof Error ? error : new Error(String(error)),
                    });
                }
            }
        };

        loadService();

        return () => {
            isMounted = false;
        };
    }, [featureName, serviceType]);

    return state;
}
