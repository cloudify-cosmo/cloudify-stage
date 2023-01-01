import { filterIdQueryParameterName } from '../../filters/common';
import { useSearchParam } from '../../../../utils/hooks';

export function getGroupIdForBatchAction() {
    return `BATCH_ACTION_${new Date().toISOString()}`;
}

export function useFilterIdFromUrl() {
    return useSearchParam(filterIdQueryParameterName);
}
