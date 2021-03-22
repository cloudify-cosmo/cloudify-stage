import i18n from 'i18next';
import { useState, useEffect } from 'react';
import { useManager } from '../managerHooks';

import type { BlueprintsData, BlueprintData } from './model';

export type BlueprintsHook = {
    loading: boolean;
    blueprints?: BlueprintData[];
    error?: string;
};

const useFetchBlueprints = () => {
    const manager = useManager();
    const [state, setState] = useState<BlueprintsHook>(() => ({ loading: true }));
    useEffect(() => {
        let mounted = true;
        const params = {
            _include:
                'id,description,main_file_name,tenant_name,created_at,updated_at,created_by,private_resource,visibility',
            _sort: '-created_at',
            _size: 50,
            _offset: 0
        };
        manager
            .doGet('/blueprints', params)
            .then((blueprints: BlueprintsData) => {
                if (mounted) {
                    setState({ loading: false, blueprints: blueprints.items });
                }
            })
            .catch(() => {
                setState({
                    loading: false,
                    error: i18n.t(
                        'gettingStartedModal.initialization.blueprintsLoadingError',
                        'Blueprints information loading error.'
                    )
                });
            });
        return () => {
            mounted = false;
        };
    }, []);
    return state;
};

export default useFetchBlueprints;
