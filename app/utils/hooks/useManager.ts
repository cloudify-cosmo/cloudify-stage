import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { ReduxState } from '../../reducers';
import Manager from '../Manager';

/**
 * Gets current manager from context.
 * @returns current manager object
 */
export default function useManager() {
    const manager = useSelector((state: ReduxState) => state.manager);
    return useMemo(() => new Manager(manager), [manager]);
}
