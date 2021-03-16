import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import Internal from '../../utils/Internal';
import Manager from '../../utils/Manager';

import type { ReduxState } from '../../reducers';

const ignoredManagerFields = ['tenants.isFetching', 'clusterStatus.isFetching'];

const compareManagers = (a: any, b: any) => _.isEqual(_.omit(a, ignoredManagerFields), _.omit(b, ignoredManagerFields));

const getCurrentDistribution = (manager: Manager) => {
    const currentDistributionName = manager.getDistributionName().trim();
    const currentDistributionRelease = manager.getDistributionRelease().trim();
    return `${currentDistributionName.toLowerCase()} ${currentDistributionRelease.toLowerCase()}`;
};

/**
 * Gets current manager from context with changes ignoring for tenants.isFetching and clusterStatus.isFetching properties.
 * @returns current manager object
 */
export const useManager = () => {
    const manager = useSelector((state: ReduxState) => state.manager, compareManagers);
    return new Manager(manager);
};

/**
 * Gets current internal from context with changes ignoring for tenants.isFetching and clusterStatus.isFetching properties.
 * @returns current internal object
 */
export const useInternal = () => {
    const manager = useSelector((state: ReduxState) => state.manager, compareManagers);
    return new Internal(manager);
};

/**
 * Gets current distribution from manager.
 * @returns current distribution
 */
export const useCurrentDistribution = () => {
    const manager = useManager();
    return useMemo(() => getCurrentDistribution(manager), [manager]);
};
