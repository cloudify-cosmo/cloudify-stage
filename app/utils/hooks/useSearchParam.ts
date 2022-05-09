import { useDispatch, useSelector } from 'react-redux';
import { replace } from 'connected-react-router';
import type { ReduxState } from '../../reducers';

/**
 * Returns a string with URL search parameter value and two functions - one to set the value in URL and
 * another one to delete it from URL
 */
export default function useSearchParam(paramName: string) {
    const dispatch = useDispatch();
    const locationSearch = useSelector((state: ReduxState): string => state.router.location.search);
    const searchParam = new URLSearchParams(locationSearch).get(paramName);

    function setSearchParam(value: string) {
        const newUrlSearchParams = new URLSearchParams(locationSearch);
        newUrlSearchParams.set(paramName, value);
        dispatch(replace({ search: newUrlSearchParams.toString() }));
    }

    function deleteSearchParam() {
        const newUrlSearchParams = new URLSearchParams(locationSearch);
        newUrlSearchParams.delete(paramName);
        dispatch(replace({ search: newUrlSearchParams.toString() }));
    }

    return [searchParam, setSearchParam, deleteSearchParam] as const;
}
