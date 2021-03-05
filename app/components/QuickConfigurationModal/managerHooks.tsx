import { useSelector } from 'react-redux';
import _ from 'lodash';

import Internal from '../../utils/Internal';
import Manager from '../../utils/Manager';
import compareObjects from './common/compareObjects';

const compareManagers = (a: any, b: any) => {
    return compareObjects(a, b, {
        tenants: {
            isFetching: true
        },
        clusterStatus: {
            isFetching: true
        }
    });
};

/**
 * Gets current manager from context with changes ignoring for tenants.isFetching and clusterStatus.isFetching properties.
 * @returns current manager object
 */
export const useManager = () => {
    const manager = useSelector((state: any) => state.manager, compareManagers);
    return new Manager(manager);
};

/**
 * Gets current internal from context with changes ignoring for tenants.isFetching and clusterStatus.isFetching properties.
 * @returns current internal object
 */
export const useInternal = () => {
    const manager = useSelector((state: any) => state.manager, compareManagers);
    return new Internal(manager);
};
