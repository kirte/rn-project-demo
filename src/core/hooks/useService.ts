import { useMemo } from 'react';
import { container } from '../di/container';

export const useService = <T,>(type: any): T => useMemo(() => container.get<T>(type), [type]);
