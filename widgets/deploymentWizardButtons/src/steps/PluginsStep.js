/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import StepActions from '../wizard/StepActions';
import StepContent from '../wizard/StepContent';
import { createWizardStep } from '../wizard/wizardUtils';
import NoResourceMessage from './helpers/NoResourceMessage';
import ResourceAction from './helpers/ResourceAction';
import ResourceStatus from './helpers/ResourceStatus';

const pluginsStepId = 'plugins';

class PluginsStepActions extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = StepActions.propTypes;

    onNext(id) {
        const { fetchData, onError, onLoading, onNext } = this.props;
        return onLoading()
            .then(fetchData)
            .then(({ stepData }) => {
                const plugins = _.pickBy(
                    stepData,
                    plugin => plugin.status !== PluginsStepContent.statusInstalledAndParametersMatched
                );

                const missingFields = [];
                const errors = {};
                _.forEach(plugins, (pluginObject, pluginName) => {
                    const wagonUrl = pluginObject.wagonFile ? '' : pluginObject.wagonUrl;
                    const yamlUrl = pluginObject.yamlFile ? '' : pluginObject.yamlUrl;
                    const wagonNotValid = _.isEmpty(wagonUrl)
                        ? !pluginObject.wagonFile
                        : !Stage.Utils.Url.isUrl(wagonUrl);
                    const yamlNotValid = _.isEmpty(yamlUrl) ? !pluginObject.yamlFile : !Stage.Utils.Url.isUrl(yamlUrl);
                    const iconNotValid =
                        !pluginObject.iconFile &&
                        !_.isEmpty(pluginObject.iconUrl) &&
                        !Stage.Utils.Url.isUrl(pluginObject.iconUrl);

                    if (wagonNotValid || yamlNotValid || iconNotValid) {
                        missingFields.push(pluginName);

                        errors[pluginName] = {
                            wagonUrl: wagonNotValid,
                            yamlUrl: yamlNotValid,
                            iconUrl: iconNotValid
                        };
                    }
                });

                if (!_.isEmpty(missingFields)) {
                    return Promise.reject({
                        message: `Please correctly fill in fields for the following plugins: ${missingFields.join(
                            ', '
                        )}.`,
                        errors
                    });
                }
                const userDefinedPlugins = _.pickBy(
                    plugins,
                    plugin => plugin.status === PluginsStepContent.statusUserDefinedPlugin
                );
                const userResources = { plugins: _.mapValues(userDefinedPlugins, () => ({ params: {} })) };
                return onNext(id, { plugins, userResources });
            })
            .catch(error => onError(id, error.message, error.errors));
    }

    render() {
        return <StepActions {...this.props} onNext={this.onNext.bind(this)} />;
    }
}

class PluginsStepContent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pluginsInCatalog: [],
            pluginsInManager: []
        };
    }

    static propTypes = StepContent.propTypes;

    static statusUnknown = 0;

    static statusInstalledAndParametersMatched = 1;

    static statusInstalledAndParametersUnmatched = 2;

    static statusNotInstalledAndInCatalog = 3;

    static statusUserDefinedPlugin = 4;

    static statusNotInstalledAndNotInCatalog = 5;

    static defaultPluginState = {
        yamlUrl: '',
        yamlFile: null,
        wagonUrl: '',
        wagonFile: null,
        iconUrl: '',
        iconFile: null,
        visibility: Stage.Common.Consts.defaultVisibility,
        status: PluginsStepContent.statusUnknown
    };

    static blueprintDataPath = 'blueprint.plugins';

    static userDataPath = 'userResources.plugins';

    static getPluginStatus(pluginName, pluginsInBlueprint, pluginsInManager, pluginsInCatalog) {
        const plugin = pluginsInBlueprint[pluginName];
        const version = _.get(plugin, 'params.version');
        const distribution = _.get(plugin, 'params.distribution');

        const pluginInManager = pluginsInManager[pluginName];
        const pluginInCatalog = pluginsInCatalog[pluginName];

        let pluginStatus = '';

        if (!_.isNil(pluginInManager)) {
            if (
                (_.isNil(version) || _.isEqual(version, pluginInManager.version)) &&
                (_.isNil(distribution) || _.isEqual(distribution, pluginInManager.distribution))
            ) {
                pluginStatus = PluginsStepContent.statusInstalledAndParametersMatched;
            } else {
                pluginStatus = PluginsStepContent.statusInstalledAndParametersUnmatched;
            }
        } else if (!_.isNil(pluginInCatalog)) {
            if (_.isNil(version) || _.isEqual(version, pluginInCatalog.version)) {
                // TODO: Check distribution
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
        const { id, onChange, onError, onLoading, onReady, toolbox, wizardData } = this.props;
        onLoading()
            .then(() =>
                Promise.all([
                    toolbox
                        .getManager()
                        .doGet('/plugins?_include=distribution,package_name,package_version,visibility'),
                    toolbox
                        .getInternal()
                        .doGet('/external/content', { url: Stage.Common.Consts.externalUrls.pluginsCatalog })
                ])
            )
            .then(([pluginsInManager, pluginsInCatalog]) => {
                const pluginsInBlueprint = _.get(wizardData, PluginsStepContent.blueprintDataPath, {});
                const pluginsInUserResources = _.get(wizardData, PluginsStepContent.userDataPath, {});

                pluginsInManager = pluginsInManager.items;
                pluginsInManager = _.reduce(
                    pluginsInManager,
                    (result, pluginObject) => {
                        result[pluginObject.package_name] = {
                            version: pluginObject.package_version,
                            distribution: pluginObject.distribution,
                            visibility: pluginObject.visibility
                        };
                        return result;
                    },
                    {}
                );

                pluginsInCatalog = _.reduce(
                    pluginsInCatalog,
                    (result, pluginObject) => {
                        result[pluginObject.name] = {
                            ..._.omit(pluginObject, 'name')
                        };
                        return result;
                    },
                    {}
                );

                const stepData = {};
                for (const plugin of _.keys(pluginsInBlueprint)) {
                    const pluginState = { ...PluginsStepContent.defaultPluginState, ...stepData[plugin] };
                    pluginState.status = PluginsStepContent.getPluginStatus(
                        plugin,
                        pluginsInBlueprint,
                        pluginsInManager,
                        pluginsInCatalog
                    );

                    if (pluginState.status === PluginsStepContent.statusNotInstalledAndInCatalog) {
                        const distro = `${toolbox
                            .getManager()
                            .getDistributionName()
                            .toLowerCase()} ${toolbox
                            .getManager()
                            .getDistributionRelease()
                            .toLowerCase()}`;
                        const wagon = _.find(pluginsInCatalog[plugin].wagons, wagon => {
                            return wagon.name.toLowerCase() === distro || wagon.name.toLowerCase() === 'any';
                        });

                        pluginState.wagonUrl = wagon.url;
                        pluginState.yamlUrl = pluginsInCatalog[plugin].link;
                    } else if (pluginState.status === PluginsStepContent.statusInstalledAndParametersMatched) {
                        pluginState.visibility = pluginsInManager[plugin].visibility;
                    }

                    stepData[plugin] = { ...pluginState };
                }
                for (const plugin of _.keys(pluginsInUserResources)) {
                    const pluginState = { ...PluginsStepContent.defaultPluginState, ...stepData[plugin] };
                    pluginState.status = PluginsStepContent.statusUserDefinedPlugin;

                    stepData[plugin] = { ...pluginState };
                }

                return { stepData, pluginsInManager, pluginsInCatalog };
            })
            .then(
                ({ stepData, pluginsInManager, pluginsInCatalog }) =>
                    new Promise(resolve =>
                        this.setState({ pluginsInManager, pluginsInCatalog }, () => {
                            onChange(id, stepData);
                            resolve();
                        })
                    )
            )
            .catch(error => onError(id, error))
            .finally(() => onReady());
    }

    getPluginStatus(pluginName) {
        const { stepData } = this.props;
        const status = _.get(stepData[pluginName], 'status');

        switch (status) {
            case PluginsStepContent.statusInstalledAndParametersMatched:
                return (
                    <ResourceStatus
                        status={ResourceStatus.noActionRequired}
                        text="Plugin already installed. No action required."
                    />
                );
            case PluginsStepContent.statusInstalledAndParametersUnmatched:
                return (
                    <ResourceStatus
                        status={ResourceStatus.actionRequired}
                        text="Plugin installed but with different parameters. Provide details."
                    />
                );
            case PluginsStepContent.statusNotInstalledAndNotInCatalog:
                return (
                    <ResourceStatus
                        status={ResourceStatus.actionRequired}
                        text="Cannot find plugin. Provide details."
                    />
                );
            case PluginsStepContent.statusUserDefinedPlugin:
                return (
                    <ResourceStatus
                        status={ResourceStatus.actionRequired}
                        text="User defined plugin. Provide details."
                    />
                );
            case PluginsStepContent.statusNotInstalledAndInCatalog:
                return (
                    <ResourceStatus
                        status={ResourceStatus.noActionRequired}
                        text="Plugin has been found in catalog and will be installed automatically. No action required."
                    />
                );
            case PluginsStepContent.statusUnknown:
                return <ResourceStatus status={ResourceStatus.unknown} text="Unknown status." />;
            default:
                return <ResourceStatus status={ResourceStatus.errorOccurred} text="Error during status calculation." />;
        }
    }

    onChange(pluginName) {
        const { id, onChange, stepData: stepDataProp } = this.props;
        return fields => {
            const stepData = { ...stepDataProp };
            stepData[pluginName] = { ...stepData[pluginName], ...fields };
            return onChange(id, { ...stepData });
        };
    }

    addUserPlugin() {
        const { id, onChange, stepData: stepDataProp } = this.props;
        const stepData = { ...stepDataProp };

        const getPluginName = (baseName = 'user-plugin', maxSuffixNumber = 1000) => {
            let pluginName = '';

            for (let pluginNameChosen = false, i = 0; i < maxSuffixNumber && !pluginNameChosen; i++) {
                pluginName = `${baseName}-${i}`;
                pluginNameChosen = !stepData[pluginName];
            }

            return pluginName;
        };

        const pluginName = getPluginName();
        stepData[pluginName] = { ...PluginsStepContent.defaultPluginState };
        stepData[pluginName].status = PluginsStepContent.statusUserDefinedPlugin;
        onChange(id, stepData);
    }

    deleteUserPlugin(pluginName) {
        const { id, onChange, stepData: stepDataProp } = this.props;
        const stepData = { ..._.omit(stepDataProp, pluginName) };
        onChange(id, stepData);
    }

    getPluginAction(pluginName) {
        const { errors, loading, stepData } = this.props;
        const status = _.get(stepData[pluginName], 'status');
        const { UploadPluginForm } = Stage.Common;

        switch (status) {
            case PluginsStepContent.statusInstalledAndParametersMatched:
                return <ResourceAction>No action required.</ResourceAction>;
            case PluginsStepContent.statusInstalledAndParametersUnmatched:
            case PluginsStepContent.statusNotInstalledAndNotInCatalog:
            case PluginsStepContent.statusUserDefinedPlugin:
                return (
                    <ResourceAction>
                        <UploadPluginForm
                            wagonUrl={stepData[pluginName].wagonUrl}
                            yamlUrl={stepData[pluginName].yamlUrl}
                            iconUrl={stepData[pluginName].iconUrl}
                            errors={errors[pluginName]}
                            wrapInForm={false}
                            addRequiredMarks={false}
                            hidePlaceholders
                            loading={loading}
                            onChange={this.onChange(pluginName).bind(this)}
                        />
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
        const { VisibilityField } = Stage.Basic;
        const { stepData } = this.props;
        const plugin = stepData[pluginName];

        switch (_.get(plugin, 'status')) {
            case PluginsStepContent.statusInstalledAndParametersMatched:
                return (
                    <ResourceAction>
                        <VisibilityField visibility={plugin.visibility} className="large" allowChange={false} />
                    </ResourceAction>
                );
            case PluginsStepContent.statusInstalledAndParametersUnmatched:
            case PluginsStepContent.statusNotInstalledAndNotInCatalog:
            case PluginsStepContent.statusNotInstalledAndInCatalog:
            case PluginsStepContent.statusUserDefinedPlugin:
                return (
                    <ResourceAction>
                        <VisibilityField
                            visibility={plugin.visibility}
                            className="large"
                            onVisibilityChange={visibility => this.onChange(pluginName)({ visibility })}
                        />
                    </ResourceAction>
                );
            default:
                return null;
        }
    }

    isUserDefinedPlugin(pluginName) {
        const { stepData } = this.props;
        return _.isEqual(
            _.get(stepData[pluginName], 'status', PluginsStepContent.statusUnknown),
            PluginsStepContent.statusUserDefinedPlugin
        );
    }

    render() {
        const { loading, stepData, wizardData } = this.props;
        const { Button, Form, Popup, Table } = Stage.Basic;
        const plugins = {
            ..._.get(wizardData, PluginsStepContent.blueprintDataPath, {}),
            ..._.get(wizardData, PluginsStepContent.userDataPath, {})
        };
        const noPlugins = _.isEmpty(stepData);

        return (
            <Form loading={loading} success={noPlugins}>
                {noPlugins ? (
                    <NoResourceMessage resourceName="plugins" />
                ) : (
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Plugin</Table.HeaderCell>
                                <Table.HeaderCell>Version</Table.HeaderCell>
                                <Table.HeaderCell>Distribution</Table.HeaderCell>
                                <Table.HeaderCell colSpan="3">Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {noPlugins ? (
                                <NoResourceMessage resourceName="plugins" />
                            ) : (
                                _.map(_.keys(stepData), pluginName => {
                                    const { pluginsInCatalog } = this.state;
                                    const pluginInCatalog = pluginsInCatalog[pluginName];
                                    const { Image } = Stage.Basic;

                                    return (
                                        <Table.Row key={pluginName} name={pluginName}>
                                            <Table.Cell collapsing>
                                                {!_.isNil(pluginInCatalog) ? (
                                                    <span>
                                                        <Image
                                                            src={pluginInCatalog.icon}
                                                            height="25"
                                                            verticalAlign="middle"
                                                            spaced="right"
                                                        />
                                                        {pluginInCatalog.title}
                                                    </span>
                                                ) : (
                                                    <span>{pluginName} </span>
                                                )}
                                                {this.isUserDefinedPlugin(pluginName) && (
                                                    <Popup
                                                        trigger={
                                                            <Button
                                                                icon="minus"
                                                                size="mini"
                                                                onClick={this.deleteUserPlugin.bind(this, pluginName)}
                                                            />
                                                        }
                                                        content="Remove plugin"
                                                    />
                                                )}
                                            </Table.Cell>
                                            <Table.Cell collapsing>
                                                {_.get(plugins[pluginName], 'params.version', '-')}
                                            </Table.Cell>
                                            <Table.Cell collapsing>
                                                {_.get(plugins[pluginName], 'params.distribution', '-')}
                                            </Table.Cell>
                                            <Table.Cell collapsing>{this.getPluginStatus(pluginName)}</Table.Cell>
                                            <Table.Cell>{this.getPluginAction(pluginName)}</Table.Cell>
                                            <Table.Cell collapsing>{this.getPluginVisibility(pluginName)}</Table.Cell>
                                        </Table.Row>
                                    );
                                })
                            )}
                        </Table.Body>
                    </Table>
                )}
                <Form.Button
                    content="Add plugin"
                    icon="add"
                    labelPosition="left"
                    onClick={this.addUserPlugin.bind(this)}
                />
            </Form>
        );
    }
}

export default createWizardStep(pluginsStepId, 'Plugins', 'Select plugins', PluginsStepContent, PluginsStepActions);
