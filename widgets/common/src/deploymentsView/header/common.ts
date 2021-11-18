import { filterIdQueryParameterName } from '../../filters/common';

export function getGroupIdForBatchAction() {
    return `BATCH_ACTION_${new Date().toISOString()}`;
}

export function useFilterIdFromUrl() {
    return Stage.Hooks.useSearchParam(filterIdQueryParameterName);
}
