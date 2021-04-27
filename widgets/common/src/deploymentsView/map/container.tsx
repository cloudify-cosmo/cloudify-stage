import { ComponentProps, FunctionComponent, useMemo } from 'react';
import { useQuery } from 'react-query';

import type { Deployment } from '../types';
import { mapT } from './common';
import DeploymentsMap from './DeploymentsMap';

interface DeploymentsMapContainerProps {
    deployments: Deployment[];
    selectedDeployment: Deployment | undefined;
    toolbox: Stage.Types.Toolbox;
    widgetDimensions: ComponentProps<typeof DeploymentsMap>['widgetDimensions'];
    environmentTypeVisible: boolean;
}

const DeploymentsMapContainer: FunctionComponent<DeploymentsMapContainerProps> = ({
    deployments,
    selectedDeployment,
    toolbox,
    widgetDimensions,
    environmentTypeVisible
}) => {
    const sitesResult = useQuery(
        'all-sites',
        (): Promise<Stage.Types.PaginatedResponse<Stage.Common.Map.Site>> =>
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

    return (
        <DeploymentsMap
            deployments={deploymentsWithSites}
            selectedDeployment={selectedDeployment}
            sites={sitesResult.data.items}
            widgetDimensions={widgetDimensions}
            toolbox={toolbox}
            environmentTypeVisible={environmentTypeVisible}
        />
    );
};
export default DeploymentsMapContainer;
