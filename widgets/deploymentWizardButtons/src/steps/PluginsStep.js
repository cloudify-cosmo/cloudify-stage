/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import React, { Component } from 'react';

import ResourceStatus from './helpers/ResourceStatus';
import ResourceAction from './helpers/ResourceAction';
import NoResourceMessage from './helpers/NoResourceMessage';

const pluginsStepId = 'plugins';
const {createWizardStep} = Stage.Basic.Wizard.Utils;

class PluginsStepActions extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = Stage.Basic.Wizard.Step.Actions.propTypes;

    onNext(id) {
        return this.props.onLoading()
            .then(this.props.fetchData)
            .then(({stepData}) => {
                const plugins = _.pickBy(stepData, (plugin) =>
                    plugin.status !== PluginsStepContent.statusInstalledAndParametersMatched);

                let missingFields = [];
                let errors = {};
                _.forEach(plugins, (pluginObject, pluginName) => {
                    const wagonUrl = pluginObject.wagonFile ? '' : pluginObject.wagonUrl;
                    const yamlUrl = pluginObject.yamlFile ? '' : pluginObject.yamlUrl;
                    const wagonNotDefined = _.isEmpty(wagonUrl) && !pluginObject.wagonFile;
                    const yamlNotDefined = _.isEmpty(yamlUrl) && !pluginObject.yamlFile;

                    if (wagonNotDefined || yamlNotDefined) {
                        missingFields.push(pluginName);

                        errors[pluginName] = {
                            wagonUrl: wagonNotDefined,
                            yamlUrl: yamlNotDefined
                        }
                    }
                });

                if (!_.isEmpty(missingFields)) {
                    return Promise.reject({
                        message: `Please fill in fields for the following plugins: ${missingFields.join(', ')}.`,
                        errors
                    });
                } else {
                    return this.props.onNext(id, {plugins});
                }
            })
            .catch((error) => this.props.onError(id, error.message, error.errors));
    }

    render() {
        let {Wizard} = Stage.Basic;
        return <Wizard.Step.Actions {...this.props} onNext={this.onNext.bind(this)} />
    }
}

class PluginsStepContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pluginsInCatalog: [],
            pluginsInManager: []
        }
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    static statusUnknown = 0;
    static statusInstalledAndParametersMatched = 1;
    static statusInstalledAndParametersUnmatched = 2;
    static statusNotInstalledAndInCatalog = 3;
    static statusNotInstalledAndNotInCatalog = 4;
    static defaultPluginState = {
        yamlUrl: '',
        yamlFile: null,
        wagonUrl: '',
        wagonFile: null,
        visibility: Stage.Common.Consts.defaultVisibility,
        status: PluginsStepContent.statusUnknown
    };
    static dataPath = 'blueprint.plugins';

    static getPluginStatus(pluginName, pluginsInBlueprint, pluginsInManager, pluginsInCatalog) {
        const plugin = pluginsInBlueprint[pluginName];
        const version = _.get(plugin, 'params.version');
        const distribution = _.get(plugin, 'params.distribution');

        const pluginInManager = pluginsInManager[pluginName];
        const pluginInCatalog = pluginsInCatalog[pluginName];

        let pluginStatus = '';

        if (!_.isNil(pluginInManager)) {
            if ((_.isNil(version) || _.isEqual(version, pluginInManager.version)) &&
                (_.isNil(distribution) || _.isEqual(distribution, pluginInManager.distribution))) {
                pluginStatus = PluginsStepContent.statusInstalledAndParametersMatched;
            } else {
                pluginStatus = PluginsStepContent.statusInstalledAndParametersUnmatched;
            }
        } else if (!_.isNil(pluginInCatalog)) {
            if ((_.isNil(version) || _.isEqual(version, pluginInCatalog.version))) { // TODO: Check distribution
                pluginStatus = PluginsStepContent.statusNotInstalledAndInCatalog;
            } else {
                pluginStatus = PluginsStepContent.statusNotInstalledAndNotInCatalog;
            }
        } else {
            pluginStatus = PluginsStepContent.statusNotInstalledAndNotInCatalog;
        }

        return pluginStatus;
    }

    componentDidMount() {
        this.props.onLoading()
            .then(() => Promise.all([
                this.props.toolbox.getManager().doGet('/plugins?_include=distribution,package_name,package_version,visibility'),
                this.props.toolbox.getExternal().doGet('http://repository.cloudifysource.org/cloudify/wagons/plugins.json')
            ]))
            .then(([pluginsInManager, pluginsInCatalog]) => {
                const pluginsInBlueprint = _.get(this.props.wizardData, PluginsStepContent.dataPath, {});

                pluginsInManager = pluginsInManager.items;
                pluginsInManager = _.reduce(pluginsInManager, (result, pluginObject) => {
                    result[pluginObject.package_name] = {
                        version: pluginObject.package_version,
                        distribution: pluginObject.distribution,
                        visibility: pluginObject.visibility
                    };
                    return result;
                }, {});

                pluginsInCatalog = _.reduce(pluginsInCatalog, (result, pluginObject) => {
                    result[pluginObject.name] = {
                        ..._.omit(pluginObject, 'name')
                    };
                    return result;
                }, {});

                let stepData = {};
                for (let plugin of _.keys(pluginsInBlueprint)) {
                    let pluginState = {...PluginsStepContent.defaultPluginState, ...this.props.stepData[plugin]};
                    pluginState.status = PluginsStepContent.getPluginStatus(plugin, pluginsInBlueprint, pluginsInManager, pluginsInCatalog);

                    if (pluginState.status === PluginsStepContent.statusNotInstalledAndInCatalog) {
                        const distro = `${this.props.toolbox.getManager().getDistributionName().toLowerCase()} ${this.props.toolbox.getManager().getDistributionRelease().toLowerCase()}`;
                        const wagon = _.find(pluginsInCatalog[plugin].wagons, (wagon) => {
                            return wagon.name.toLowerCase() === distro || wagon.name.toLowerCase() === 'any';
                        });

                        pluginState.wagonUrl = wagon.url;
                        pluginState.yamlUrl = pluginsInCatalog[plugin].link;
                    } else if (pluginState.status === PluginsStepContent.statusInstalledAndParametersMatched) {
                        pluginState.visibility = pluginsInManager[plugin].visibility;
                    }

                    stepData[plugin] = {...pluginState};
                }

                return {stepData, pluginsInManager, pluginsInCatalog};
            })
            .then(({stepData, pluginsInManager, pluginsInCatalog}) =>
                new Promise((resolve) => this.setState({pluginsInManager, pluginsInCatalog}, () => {
                    this.props.onChange(this.props.id, stepData);
                    resolve();
                })))
            .catch((error) => this.props.onError(this.props.id, error))
            .finally(() => this.props.onReady());
    }

    getPluginStatus(pluginName) {
        const status = _.get(this.props.stepData[pluginName], 'status');

        switch (status) {
            case PluginsStepContent.statusInstalledAndParametersMatched:
                return <ResourceStatus status={ResourceStatus.noActionRequired}
                                       text='Plugin already installed. No action required.' />;
            case PluginsStepContent.statusInstalledAndParametersUnmatched:
                return <ResourceStatus status={ResourceStatus.actionRequired}
                                       text='Plugin installed but with different parameters. Provide details.' />;
            case PluginsStepContent.statusNotInstalledAndNotInCatalog:
                return <ResourceStatus status={ResourceStatus.actionRequired}
                                       text='Cannot find plugin. Provide details.' />;
            case PluginsStepContent.statusNotInstalledAndInCatalog:
                return <ResourceStatus status={ResourceStatus.noActionRequired}
                                       text='Plugin has been found in catalog and will be installed automatically. No action required.' />;
            case PluginsStepContent.statusUnknown:
                return <ResourceStatus status={ResourceStatus.unknown}
                                       text='Unknown status.' />;
            default:
                return <ResourceStatus status={ResourceStatus.errorOccurred}
                                       text='Error during status calculation.' />;
        }
    }

    onChange(pluginName) {
        return (fields) => {
            let stepData = {...this.props.stepData};
            stepData[pluginName] = {...stepData[pluginName], ...fields};
            return this.props.onChange(this.props.id, {...stepData});
        }
    }

    getPluginAction(pluginName) {
        const status = _.get(this.props.stepData[pluginName], 'status');
        let {UploadPluginForm} = Stage.Common;

        switch (status) {
            case PluginsStepContent.statusInstalledAndParametersMatched:
                return <ResourceAction>No action required.</ResourceAction>;
            case PluginsStepContent.statusInstalledAndParametersUnmatched:
            case PluginsStepContent.statusNotInstalledAndNotInCatalog:
                return (
                    <ResourceAction>
                        <UploadPluginForm wagonUrl={this.props.stepData[pluginName].wagonUrl}
                                          wagonFile={this.props.stepData[pluginName].wagonFile}
                                          wagonPlaceholder=''
                                          yamlUrl={this.props.stepData[pluginName].yamlUrl}
                                          yamlFile={this.props.stepData[pluginName].yamlFile}
                                          yamlPlaceholder=''
                                          errors={this.props.errors[pluginName]}
                                          wrapInForm={false}
                                          loading={this.props.loading}
                                          onChange={this.onChange(pluginName).bind(this)} />
                    </ResourceAction>
                );
            case PluginsStepContent.statusNotInstalledAndInCatalog:
                return <ResourceAction>No action required.</ResourceAction>;
            case PluginsStepContent.statusUnknown:
                return <ResourceAction />;
            default:
                return <ResourceAction />;
        }
    }

    getPluginVisibility(pluginName) {
        let {VisibilityField} = Stage.Basic;
        let plugin = this.props.stepData[pluginName];

        switch (_.get(plugin, 'status')) {
            case PluginsStepContent.statusInstalledAndParametersMatched:
                return (
                    <ResourceAction>
                        <VisibilityField visibility={plugin.visibility} className='large' allowChange={false} />
                    </ResourceAction>
                );
            case PluginsStepContent.statusInstalledAndParametersUnmatched:
            case PluginsStepContent.statusNotInstalledAndNotInCatalog:
            case PluginsStepContent.statusNotInstalledAndInCatalog:
                return (
                    <ResourceAction>
                        <VisibilityField visibility={plugin.visibility} className='large'
                                         onVisibilityChange={(visibility) => this.onChange(pluginName)({visibility})} />
                    </ResourceAction>
                );
            default:
                return null;
        }
    }


    render() {
        let {Form, Table} = Stage.Basic;
        const plugins = _.get(this.props.wizardData, PluginsStepContent.dataPath, {});
        const noPlugins = _.isEmpty(plugins);

        return (
            <Form loading={this.props.loading} success={noPlugins}>
                {
                    noPlugins
                    ?
                        <NoResourceMessage resourceName='plugins' />
                    :
                        <Table celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Plugin</Table.HeaderCell>
                                    <Table.HeaderCell>Version</Table.HeaderCell>
                                    <Table.HeaderCell>Distribution</Table.HeaderCell>
                                    <Table.HeaderCell colSpan='3'>Action</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {
                                    _.map(_.keys(this.props.stepData), (pluginName) => {
                                        const pluginInCatalog = this.state.pluginsInCatalog[pluginName];
                                        let {Image} = Stage.Basic;

                                        return (
                                            <Table.Row key={pluginName}>
                                                <Table.Cell collapsing>
                                                    {
                                                        !_.isNil(pluginInCatalog)
                                                        ?
                                                            <span>
                                                                <Image src={pluginInCatalog.icon} height='25' verticalAlign='middle' spaced='right' />
                                                                {pluginInCatalog.title}
                                                            </span>
                                                        :
                                                            <span>{pluginName}</span>
                                                    }
                                                </Table.Cell>
                                                <Table.Cell collapsing>{_.get(plugins[pluginName], 'params.version', '-')}</Table.Cell>
                                                <Table.Cell collapsing>{_.get(plugins[pluginName], 'params.distribution', '-')}</Table.Cell>
                                                <Table.Cell collapsing>{this.getPluginStatus(pluginName)}</Table.Cell>
                                                <Table.Cell>{this.getPluginAction(pluginName)}</Table.Cell>
                                                <Table.Cell collapsing>{this.getPluginVisibility(pluginName)}</Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                }
                            </Table.Body>
                        </Table>
                }
            </Form>
        );
    }
}

export default createWizardStep(pluginsStepId,
                                'Plugins',
                                'Select plugins',
                                PluginsStepContent,
                                PluginsStepActions);
