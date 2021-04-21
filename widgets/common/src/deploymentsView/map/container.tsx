import { FunctionComponent, useMemo } from 'react';
import { useQuery } from 'react-query';

import type { Deployment } from '../types';
import { mapT, Site } from './common';
import DeploymentsMap from './map';

interface DeploymentsMapContainerProps {
    deployments: Deployment[];
    toolbox: Stage.Types.Toolbox;
}

const DeploymentsMapContainer: FunctionComponent<DeploymentsMapContainerProps> = ({ deployments, toolbox }) => {
    // TODO: extract fetching to a new component for using `useMemo` only when data is available
    const sitesResult = useQuery(
        'all-sites',
        (): Promise<Stage.Types.PaginatedResponse<Site>> =>
            toolbox.getManager().doGet('/sites', {
                _include: 'name,latitude,longitude',
                _get_all_results: true
            })
    );
    const mapAvailableResult = useQuery(
        'map-available',
        (): Promise<boolean> => new Stage.Common.MapsActions(toolbox).isAvailable()
    );

    const deploymentsWithSites = useMemo(() => deployments.filter(deployment => deployment.site_name), [deployments]);

    if (sitesResult.isLoading || mapAvailableResult.isLoading) {
        const { Loading } = Stage.Basic;

        return <Loading message={mapT('loadingSites')} />;
    }

    if (sitesResult.isError || mapAvailableResult.isError) {
        const { ErrorMessage } = Stage.Basic;

        return <ErrorMessage header={mapT('errorLoadingSites')} error={sitesResult.error as { message: string }} />;
    }

    if (sitesResult.isIdle || mapAvailableResult.isIdle) {
        throw new Error('Idle state for fetching map data is not handled');
    }

    const mapAvailable = mapAvailableResult.data;
    if (!mapAvailable) {
        return <Stage.Common.NoDataMessage repositoryName="maps" />;
    }

    return <DeploymentsMap deployments={deploymentsWithSites} sites={sitesResult.data.items} />;
};
export default DeploymentsMapContainer;
