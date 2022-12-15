import type { ComponentProps, FunctionComponent } from 'react';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import NoDataMessage from '../../components/NoDataMessage';
import DeploymentActions from '../../deployments/DeploymentActions';
import MapsActions from '../../map/MapsActions';
import type { Site } from '../../map/site';

import type { Deployment } from '../types';
import { tMap } from './common';
import DeploymentsMap from './DeploymentsMap';
import { ErrorMessage, Loading } from '../../../../components/basic';

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
        (): Promise<Stage.Types.PaginatedResponse<Site>> =>
            new DeploymentActions(toolbox.getManager()).doGetSitesNamesAndLocations()
    );
    const mapAvailableResult = useQuery(
        'map-available',
        (): Promise<boolean> => new MapsActions(toolbox).isAvailable()
    );

    const deploymentsWithSites = useMemo(() => deployments.filter(deployment => deployment.site_name), [deployments]);

    if (sitesResult.isLoading || mapAvailableResult.isLoading) {
        return <Loading message={tMap('loadingSites')} />;
    }

    if (sitesResult.isError || mapAvailableResult.isError) {
        return <ErrorMessage header={tMap('errorLoadingSites')} error={sitesResult.error as { message: string }} />;
    }

    if (sitesResult.isIdle || mapAvailableResult.isIdle) {
        throw new Error('Idle state for fetching map data is not handled');
    }

    const mapAvailable = mapAvailableResult.data;
    if (!mapAvailable) {
        return <NoDataMessage repositoryName="maps" />;
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
