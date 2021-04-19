import i18n from 'i18next';
import { useMemo } from 'react';

import { useManagerFetch } from '../common/fetchHooks';

import type { BlueprintsResponse, BlueprintResponse } from './model';
import type { FetchHook } from '../common/fetchHooks';

const defaultParams = {
    _include: 'id,description,main_file_name,tenant_name,created_at,updated_at,created_by,private_resource,visibility',
    _sort: '-created_at',
    _size: 50,
    _offset: 0
};

export type BlueprintsHook = FetchHook<BlueprintResponse[]>;

const useFetchBlueprints = () => {
    const managerSecrets = useManagerFetch<BlueprintsResponse>('/blueprints', defaultParams);
    return useMemo(() => {
        return {
            loading: managerSecrets.loading,
            response: managerSecrets.response?.items,
            error: managerSecrets.error
                ? i18n.t('gettingStartedModal.initialization.blueprintsMetadataLoadingError')
                : undefined
        } as BlueprintsHook;
    }, [managerSecrets]);
};

export default useFetchBlueprints;
