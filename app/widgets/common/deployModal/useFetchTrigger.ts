import type { DependencyList } from 'react';
import { useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

const useFetchTrigger = (fetchTrigger: () => void, fetchDependencies: DependencyList) => {
    const delayMs = 500;
    const debouncedFetchTrigger = useCallback(debounce(fetchTrigger, delayMs), []);

    useEffect(() => {
        debouncedFetchTrigger();
    }, fetchDependencies);
};

export default useFetchTrigger;
