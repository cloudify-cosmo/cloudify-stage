/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import { Component } from 'react';

class PluginsStepContent extends Component {
    constructor(props, context) {
        super(props);

        this.state = {
            pluginsInCatalog: [],
            pluginsInManager: [],
            stepData: {}
        }
    }

    static propTypes = Stage.Basic.Wizard.Step.Content.propTypes;

    static installed_ParametersMatched = 'installed_ParametersMatched';
    static installed_ParametersUnmatched = 'installed_ParametersUnmatched';
    static notInstalled_InCatalog = 'notInstalled_InCatalog';
    static notInstalled_NotInCatalog = 'notInstalled_NotInCatalog';

    componentDidMount() {
        const plugins = this.props.wizardData.plugins || {};

        this.props.onLoading(this.props.id, () => {
            let promises = [
                this.props.toolbox.getManager().doGet('/plugins?_include=distribution,package_name,package_version'),
                this.props.toolbox.getExternal().doGet('http://repository.cloudifysource.org/cloudify/wagons/plugins.json')
            ];

            Promise.all(promises)
                .then(([pluginsInManager, pluginsInCatalog]) => {
                    pluginsInManager = pluginsInManager.items;
                    pluginsInManager = _.reduce(pluginsInManager, (result, pluginObject) => {
                        result[pluginObject.package_name] = {
                            version: pluginObject.package_version,
                            distribution: pluginObject.distribution
                        };
                        return result;
                    }, {});

                    pluginsInCatalog = _.reduce(pluginsInCatalog, (result, pluginObject) => {
                        result[pluginObject.name] = {
                            ..._.omit(pluginObject, 'name')
                        };
                        return result;
                    }, {});

                    this.setState({pluginsInManager, pluginsInCatalog})
                })
                .then(() => {
                    let stepData = {};
                    for (let plugin of _.keys(plugins)) {
                        stepData[plugin] = this.props.stepData[plugin] || '';
                    }
                    this.setState({stepData});
                })
                .catch((error) => this.props.onError(this.props.id, error))
                .finally(() => this.props.onReady(this.props.id));
        });
    }

    handleChange(event, {name, value}) {
        this.setState({stepData: {...this.state.stepData, [name]: value}},
            () => this.props.onChange(this.props.id, this.state.stepData));
    }

    getPluginStatus(pluginName) {
        const plugins = this.props.wizardData.plugins || {};

        const plugin = plugins[pluginName];
        const version = _.get(plugin, 'params.version');
        const distribution = _.get(plugin, 'params.distribution');

        const pluginInManager = this.state.pluginsInManager[pluginName];
        const pluginInCatalog = this.state.pluginsInCatalog[pluginName];

        let pluginStatus = '';

        if (!_.isNil(pluginInManager)) {
            if ((_.isNil(version) || _.isEqual(version, pluginInManager.version)) &&
                (_.isNil(distribution) || _.isEqual(distribution, pluginInManager.distribution))) {
                pluginStatus = PluginsStepContent.installed_ParametersMatched;
            } else {
                pluginStatus = PluginsStepContent.installed_ParametersUnmatched;
            }
        } else if (!_.isNil(pluginInCatalog)) {
            if ((_.isNil(version) || _.isEqual(version, pluginInCatalog.version))) { // TODO: Check distribution
                pluginStatus = PluginsStepContent.notInstalled_InCatalog;
            } else {
                pluginStatus = PluginsStepContent.notInstalled_NotInCatalog;
            }
        } else {
            pluginStatus = PluginsStepContent.notInstalled_NotInCatalog;
        }

        return pluginStatus;
    }

    getPluginInstalled(pluginName) {
        const pluginStatus = this.getPluginStatus(pluginName);
        let {Checkmark} = Stage.Basic;

        switch (pluginStatus) {
            case PluginsStepContent.installed_ParametersMatched:
                return <Checkmark value={true}/>;
            case PluginsStepContent.installed_ParametersUnmatched:
            case PluginsStepContent.notInstalled_NotInCatalog:
            case PluginsStepContent.notInstalled_InCatalog:
            default:
                return <Checkmark value={false}/>;
        }
    }

    getPluginAction(pluginName) {
        const pluginStatus = this.getPluginStatus(pluginName);
        let {Icon} = Stage.Basic;
        let action = null;

        switch (pluginStatus) {
            case PluginsStepContent.installed_ParametersMatched:
                action = <strong><Icon name='check circle' color='green' /> Plugin alread installed. No action required.</strong>;
                break;
            case PluginsStepContent.installed_ParametersUnmatched:
                action = <strong><Icon name='warning circle' color='yellow' /> Plugin installed but with different parameters. Provide details.</strong>;
                break;
            case PluginsStepContent.notInstalled_NotInCatalog:
                action = <strong><Icon name='warning circle' color='yellow' /> Cannot find plugin. Provide details.</strong>;
                break;
            case PluginsStepContent.notInstalled_InCatalog:
                action = <strong><Icon name='check circle' color='green' /> Plugin has been found in catalog and will be installed automatically. No action required.</strong>;
                break;
            default:
                action = <strong><Icon name="remove circle" color='red' /> Invalid status.</strong>;
        }

        return action;
    }

    getPluginIcon(pluginName) {
        const pluginInCatalog = this.state.pluginsInCatalog[pluginName];
        let {Image} = Stage.Basic;

        if (!_.isNil(pluginInCatalog)) {
            return <Image src={pluginInCatalog.icon} inline height='25' />;
        } else {
            return null;
        }
    }

    getPluginUserFriendlyName(pluginName) {
        const pluginInCatalog = this.state.pluginsInCatalog[pluginName];

        if (!_.isNil(pluginInCatalog)) {
            return pluginInCatalog.title;
        } else {
            return pluginName;
        }
    }

    render() {
        let {Table, Wizard} = Stage.Basic;
        const plugins = this.props.wizardData.plugins || {};

        return (
            <Wizard.Step.Content {...this.props}>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell></Table.HeaderCell>
                            <Table.HeaderCell>Plugin</Table.HeaderCell>
                            <Table.HeaderCell>Version</Table.HeaderCell>
                            <Table.HeaderCell>Distribution</Table.HeaderCell>
                            <Table.HeaderCell>Installed</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                    {
                        _.map(_.keys(plugins), (pluginName) =>
                            <Table.Row key={pluginName}>
                                <Table.Cell textAlign='center' width={1}>{this.getPluginIcon(pluginName)}</Table.Cell>
                                <Table.Cell>{this.getPluginUserFriendlyName(pluginName)}</Table.Cell>
                                <Table.Cell>{plugins[pluginName].version || '-'}</Table.Cell>
                                <Table.Cell>{plugins[pluginName].distribution || '-'}</Table.Cell>
                                <Table.Cell textAlign='center' width={1}>{this.getPluginInstalled(pluginName)}</Table.Cell>
                                <Table.Cell>{this.getPluginAction(pluginName)}</Table.Cell>
                            </Table.Row>
                        )
                    }
                    </Table.Body>

                    <Table.Footer>

                    </Table.Footer>
                </Table>
            </Wizard.Step.Content>
        );
    }
}

export default Stage.Basic.Wizard.Utils.createWizardStep('plugins', 'Plugins', 'Select plugins', PluginsStepContent);
