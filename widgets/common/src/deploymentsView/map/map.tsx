import { Dictionary, keyBy } from 'lodash';
import { FunctionComponent, useMemo } from 'react';

import type { Deployment } from '../types';
import type { Site } from './common';

interface DeploymentsMapProps {
    deployments: Deployment[];
    sites: Site[];
}

const DeploymentsMap: FunctionComponent<DeploymentsMapProps> = ({ deployments, sites }) => {
    const sitesLookupTable = useMemo(() => getSitesLookupTable(sites), [sites]);
    const deploymentSitePairs = useMemo(() => getDeploymentSitePairs(sitesLookupTable, deployments), [
        sitesLookupTable,
        deployments
    ]);

    console.log(deploymentSitePairs);

    /** TODO: Create markers and display the map */

    return <>Hey I am a map</>;
};
export default DeploymentsMap;

const getSitesLookupTable = (sites: Site[]) =>
    keyBy(
        sites.filter(site => site.latitude),
        'name'
    );

interface DeploymentSitePair {
    deployment: Deployment;
    site: Site;
}

const getDeploymentSitePairs = (sitesLookupTable: Dictionary<Site>, deployments: Deployment[]): DeploymentSitePair[] =>
    deployments.map((deployment): DeploymentSitePair => ({ deployment, site: sitesLookupTable[deployment.site_name] }));
