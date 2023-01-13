import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import Internal from '../../../../utils/Internal';
import useManager from '../../../../utils/hooks/useManager';

import type { ReduxState } from '../../../../reducers';

/**
 * Gets current internal from context.
 * @returns current internal object
 */
export const useInternal = () => {
    const manager = useSelector((state: ReduxState) => state.manager);
    return useMemo(() => new Internal(manager), [manager]);
};

/**
 * Gets current distribution from manager.
 * @returns current distribution
 */
export const useCurrentDistribution = () => {
    const manager = useManager();
    return useMemo(() => manager.getDistribution(), [manager]);
};
