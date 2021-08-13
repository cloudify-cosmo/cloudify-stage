import { filterIdQueryParameterName } from '../../filters/common';

export function getGroupIdForBatchAction() {
    return `BATCH_ACTION_${new Date().toISOString()}`;
}

export function useFilterIdFromUrl() {
    return ReactRedux.useSelector((state: Stage.Types.ReduxState): string | null => {
        const searchParams = new URLSearchParams(state.router.location.search);
        return searchParams.get(filterIdQueryParameterName);
    });
}
