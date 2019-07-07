
import SitesMap from './SitesMap';

const MAP_URL = 'https://maps.wikimedia.org';

Stage.defineWidget({
    id: 'sitesMap',
    name: 'Sites Map',
    description: 'This widget displays a map view of sites by location with site deployments status summary',
    initialWidth: 6,
    initialHeight: 30,
    color: 'green',
    isReact: true,
    hasReadme: true,
    hasStyle: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('sitesMap'),
    categories: [Stage.GenericConfig.CATEGORY.SPIRE],
    supportedEditions: [Stage.Common.Consts.licenseEdition.spire],
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        {id: "showAllLabels", name: "Show all the site labels", default: false, type: Stage.Basic.GenericField.BOOLEAN_TYPE}
    ],

    _processSite(site, siteStatuses, deploymentsData, executionsData, nodeInstanceData) {
        const { groupStates, getDeploymentState, GOOD_STATE } = Stage.Common.DeploymentStates;
        let siteState = GOOD_STATE;
        let deploymentStates = _.reduce(groupStates, function(result, value, key) {
            result[key] = [];
            return result;
        }, {});

        _.forEach(deploymentsData[site.name], (deployment) => {
            const lastExecution = _.first(executionsData[deployment.id]);
            const currentState = getDeploymentState(deployment.id, nodeInstanceData, lastExecution);
            deploymentStates[currentState].push(deployment.id);
            if (groupStates[currentState].severity > groupStates[siteState].severity) {
                siteState = currentState;
            }
        });

        siteStatuses[site.name] = {...site};
        siteStatuses[site.name]['deploymentStates'] = deploymentStates;
        siteStatuses[site.name]['color'] = deploymentsData[site.name] ? groupStates[siteState].colorSUI : 'grey';
    },

    _processData(data) {
        const nodeInstanceData = _.reduce(data[2].items, (result, item) => {
            result[item.deployment_id] = {
                states: _.reduce(item['by state'], (result, state) => {
                    result[state.state] = state.node_instances;
                    return result;
                }, {}),
                count: item.node_instances
            };
            return result;
        }, {});

        const sitesData = data[0];
        const deploymentsData = _.groupBy(data[1].items, 'site_name');
        const executionsData = _.groupBy(data[3].items, 'deployment_id');
        let siteStatuses = {};

        _.forEach(sitesData, (site) => {
            this._processSite(site, siteStatuses, deploymentsData, executionsData, nodeInstanceData);
        });

        const isMapAvailable = data[4];
        const sitesAreDefined = data[5].items.length > 0;
        return {siteStatuses, isMapAvailable, sitesAreDefined};
    },

    fetchData: function(widget, toolbox) {
        let allSites = toolbox.getManager().doGet('/sites', {
            _include: 'name,latitude,longitude',
            _get_all_results: true
        });

        // Leave only the sites with location
        let sitesData = allSites.then(data => _.filter(data.items, site => !_.isNil(site.latitude)));
        let siteNames = sitesData.then(data =>_.map(data.items, site => site.name));

        let deploymentsData = siteNames.then(names =>
            toolbox.getManager().doGet('/deployments', {
                _include: 'id,site_name',
                _get_all_results: true,
                site_name: names
            })
        );
        let deploymentIds = deploymentsData.then(data => _.map(data.items, deployment => deployment.id));

        let nodeInstanceData = deploymentIds.then(ids =>
            toolbox.getManager().doGet('/summary/node_instances', {
                _target_field: 'deployment_id',
                _sub_field: 'state',
                _get_all_results: true,
                deployment_id: ids
            })
        );

        let executionsData = deploymentIds.then(ids =>
            toolbox.getManager().doGet('/executions', {
                _include: 'id,deployment_id,workflow_id,status,status_display,created_at,ended_at',
                _sort: '-ended_at',
                _get_all_results: true,
                deployment_id: ids
            })
        );

        const isMapAvailable = toolbox.getExternal().isReachable(MAP_URL);
        return Promise.all([sitesData, deploymentsData, nodeInstanceData, executionsData, isMapAvailable, allSites])
            .then((data) => {return data});
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        const {siteStatuses, isMapAvailable, sitesAreDefined} = this._processData(data);
        return (
            <SitesMap data={siteStatuses}
                      toolbox={toolbox}
                      showAllLabels={widget.configuration.showAllLabels}
                      isMapAvailable={isMapAvailable}
                      sitesAreDefined={sitesAreDefined}
                      mapUrl={MAP_URL}
            />
        );
    }
});
