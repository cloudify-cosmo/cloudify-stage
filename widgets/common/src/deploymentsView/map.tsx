import type { FunctionComponent } from 'react';
import { useQuery } from 'react-query';

import { i18nPrefix } from './common';
import type { Deployment } from './types';

interface DeploymentsMapProps {
    deployments: Deployment[];
    toolbox: Stage.Types.Toolbox;
}

interface Site {
    name: string;
    latitude: number | null;
    longitude: number | null;
}

const mapT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.map.${suffix}`);

const DeploymentsMap: FunctionComponent<DeploymentsMapProps> = ({ toolbox }) => {
    const sitesResult = useQuery(
        'all-sites',
        (): Promise<Stage.Types.PaginatedResponse<Site>> =>
            toolbox.getManager().doGet('/sites', {
                _include: 'name,latitude,longitude',
                _get_all_results: true
            })
    );

    if (sitesResult.isLoading) {
        const { Loading } = Stage.Basic;

        return <Loading message={mapT('loadingSites')} />;
    }

    if (sitesResult.isError) {
        const { ErrorMessage } = Stage.Basic;

        return <ErrorMessage header={mapT('errorLoadingSites')} error={sitesResult.error as { message: string }} />;
    }
    /**
     * TODO:
     * 1. Fetch sites (DONE)
     * 2. Match sites and deployments
     * 3. Create markers and display the map
     */

    return <>Hey I am a map</>;
};
export default DeploymentsMap;
