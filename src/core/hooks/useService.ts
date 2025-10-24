import { useMemo } from 'react';
import { container } from '../di/container';

/**
 * Hook to resolve a service from the DI container
 * 
 * IMPORTANT: Ensure the service type is registered in the container before using this hook.
 * Feature containers should be imported in navigation files before importing screens.
 */
export const useService = <T,>(type: any): T => {
    return useMemo(() => {
        if (!container) {
            throw new Error('DI container is not initialized. Make sure reflect-metadata is imported first in index.js');
        }

        if (!container.isBound(type)) {
            throw new Error(`Service type ${type.toString()} is not registered in the DI container. Make sure the feature's DI container is imported before the screen component.`);
        }

        return container.get<T>(type);
    }, [type]);
};
