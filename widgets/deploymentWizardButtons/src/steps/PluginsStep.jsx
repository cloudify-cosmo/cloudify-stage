/* eslint-disable max-classes-per-file */
/**
 * Created by jakub.niezgoda on 31/07/2018.
 */

import StepActions from '../wizard/StepActions';
import { createWizardStep } from '../wizard/wizardUtils';
import NoResourceMessage from './helpers/NoResourceMessage';
import ResourceAction from './helpers/ResourceAction';
import ResourceStatus from './helpers/ResourceStatus';
import StepContentPropTypes from './StepContentPropTypes';

const pluginsStepId = 'plugins';

const pluginStatuses = {
    unknown: 0,
    installedAndParametersMatched: 1,
    installedAndParametersUnmatched: 2,
    notInstalledAndInCatalog: 3,
    userDefinedPlugin: 4,
    notInstalledAndNotInCatalog: 5
};

function PluginsStepActions({
    onClose,
    onStartOver,
    onPrev,
    onNext,
    onError,
    onLoading,
    onReady,
    disabled,
    showPrev,
    fetchData,
    wizardData,
    toolbox,
    id
}) {
    function handleNext(stepId) {
        return onLoading()
            .then(fetchData)
            .then(({ stepData }) => {
                const plugins = _.pickBy(
                    stepData,
                    plugin => plugin.status !== pluginStatuses.installedAndParametersMatched
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
                    const titleNotValid = !pluginObject.title;

                    if (wagonNotValid || yamlNotValid || iconNotValid) {
                        missingFields.push(pluginName);

                        errors[pluginName] = {
                            wagonUrl: wagonNotValid,
                            yamlUrl: yamlNotValid,
                            iconUrl: iconNotValid,
                            title: titleNotValid
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
                    plugin => plugin.status === pluginStatuses.userDefinedPlugin
                );
                const userResources = { plugins: _.mapValues(userDefinedPlugins, () => ({ params: {} })) };
                return onNext(stepId, { plugins, userResources });
            })
            .catch(error => onError(id, error.message, error.errors));
    }

    return (
        <StepActions
            id={id}
            onClose={onClose}
            onStartOver={onStartOver}
            onPrev={onPrev}
            onError={onError}
            onLoading={onLoading}
            onReady={onReady}
            disabled={disabled}
            showPrev={showPrev}
            fetchData={fetchData}
            wizardData={wizardData}
            toolbox={toolbox}
            onNext={handleNext}
        />
    );
}

PluginsStepActions.propTypes = StepActions.propTypes;

class PluginsStepContent extends React.Component {
    static defaultPluginState = {
        yamlUrl: '',
        yamlFile: null,
        wagonUrl: '',
        wagonFile: null,
        iconUrl: '',
        iconFile: null,
        visibility: Stage.Common.Consts.defaultVisibility,
        status: pluginStatuses.unknown
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
                pluginStatus = pluginStatuses.installedAndParametersMatched;
            } else {
                pluginStatus = pluginStatuses.installedAndParametersUnmatched;
            }
        } else if (!_.isNil(pluginInCatalog)) {
            if (_.isNil(version) || _.isEqual(version, pluginInCatalog.version)) {
                // TODO: Check distribution
                pluginStatus = pluginStatuses.notInstalledAndInCatalog;
            } else {
                pluginStatus = pluginStatuses.notInstalledAndNotInCatalog;
            }
        } else {
            pluginStatus = pluginStatuses.notInstalledAndNotInCatalog;
        }

        return pluginStatus;
    }

    constructor(props) {
        super(props);

        this.state = {
            pluginsInCatalog: []
        };
    }

    componentDidMount() {
        const { id, onChange, onError, onLoading, onReady, stepData: stepDataProp, toolbox, wizardData } = this.props;
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

                let formattedPluginsInManager = pluginsInManager.items;
                formattedPluginsInManager = _.reduce(
                    formattedPluginsInManager,
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

                const formattedPluginsInCatalog = _.reduce(
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
                _.forEach(_.keys(pluginsInBlueprint), plugin => {
                    const pluginState = { ...PluginsStepContent.defaultPluginState, ...stepDataProp[plugin] };
                    pluginState.status = PluginsStepContent.getPluginStatus(
                        plugin,
                        pluginsInBlueprint,
                        formattedPluginsInManager,
                        formattedPluginsInCatalog
                    );

                    if (pluginState.status === pluginStatuses.notInstalledAndInCatalog) {
                        const distro = `${toolbox
                            .getManager()
                            .getDistributionName()
                            .toLowerCase()} ${toolbox.getManager().getDistributionRelease().toLowerCase()}`;
                        const matchingWagon = _.find(
                            formattedPluginsInCatalog[plugin].wagons,
                            wagon => wagon.name.toLowerCase() === distro || wagon.name.toLowerCase() === 'any'
                        );

                        pluginState.wagonUrl = matchingWagon.url;
                        pluginState.yamlUrl = formattedPluginsInCatalog[plugin].link;
                        pluginState.title = formattedPluginsInCatalog[plugin].title;
                    } else if (pluginState.status === pluginStatuses.installedAndParametersMatched) {
                        pluginState.visibility = formattedPluginsInManager[plugin].visibility;
                    }

                    stepData[plugin] = { ...pluginState };
                });
                _.forEach(_.keys(pluginsInUserResources), plugin => {
                    const pluginState = { ...PluginsStepContent.defaultPluginState, ...stepDataProp[plugin] };
                    pluginState.status = pluginStatuses.userDefinedPlugin;

                    stepData[plugin] = { ...pluginState };
                });

                return { stepData, pluginsInCatalog: formattedPluginsInCatalog };
            })
            .then(
                ({ stepData, pluginsInCatalog }) =>
                    new Promise(resolve =>
                        this.setState({ pluginsInCatalog }, () => {
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
            case pluginStatuses.installedAndParametersMatched:
                return (
                    <ResourceStatus
                        status={ResourceStatus.noActionRequired}
                        text="Plugin already installed. No action required."
                    />
                );
            case pluginStatuses.installedAndParametersUnmatched:
                return (
                    <ResourceStatus
                        status={ResourceStatus.actionRequired}
                        text="Plugin installed but with different parameters. Provide details."
                    />
                );
            case pluginStatuses.notInstalledAndNotInCatalog:
                return (
                    <ResourceStatus
                        status={ResourceStatus.actionRequired}
                        text="Cannot find plugin. Provide details."
                    />
                );
            case pluginStatuses.userDefinedPlugin:
                return (
                    <ResourceStatus
                        status={ResourceStatus.actionRequired}
                        text="User defined plugin. Provide details."
                    />
                );
            case pluginStatuses.notInstalledAndInCatalog:
                return (
                    <ResourceStatus
                        status={ResourceStatus.noActionRequired}
                        text="Plugin has been found in catalog and will be installed automatically. No action required."
                    />
                );
            case pluginStatuses.unknown:
                return <ResourceStatus status={ResourceStatus.unknown} text="Unknown status." />;
            default:
                return <ResourceStatus status={ResourceStatus.errorOccurred} text="Error during status calculation." />;
        }
    }

    getPluginAction(pluginName) {
        const { errors, stepData, toolbox } = this.props;
        const status = _.get(stepData[pluginName], 'status');
        const { UploadPluginForm } = Stage.Common;
        const { Container } = Stage.Basic;

        switch (status) {
            case pluginStatuses.installedAndParametersMatched:
                return <ResourceAction>No action required.</ResourceAction>;
            case pluginStatuses.installedAndParametersUnmatched:
            case pluginStatuses.notInstalledAndNotInCatalog:
            case pluginStatuses.userDefinedPlugin:
                return (
                    <ResourceAction>
                        <Container fluid>
                            <UploadPluginForm
                                wagonUrl={stepData[pluginName].wagonUrl}
                                yamlUrl={stepData[pluginName].yamlUrl}
                                iconUrl={stepData[pluginName].iconUrl}
                                errors={errors[pluginName]}
                                addRequiredMarks={false}
                                hidePlaceholders
                                toolbox={toolbox}
                                onChange={this.handlePluginChange(pluginName)}
                            />
                        </Container>
                    </ResourceAction>
                );
            case pluginStatuses.notInstalledAndInCatalog:
                return <ResourceAction>No action required.</ResourceAction>;
            case pluginStatuses.unknown:
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
            case pluginStatuses.installedAndParametersMatched:
                return (
                    <ResourceAction>
                        <VisibilityField visibility={plugin.visibility} className="large" allowChange={false} />
                    </ResourceAction>
                );
            case pluginStatuses.installedAndParametersUnmatched:
            case pluginStatuses.notInstalledAndNotInCatalog:
            case pluginStatuses.notInstalledAndInCatalog:
            case pluginStatuses.userDefinedPlugin:
                return (
                    <ResourceAction>
                        <VisibilityField
                            visibility={plugin.visibility}
                            className="large"
                            onVisibilityChange={visibility => this.handlePluginChange(pluginName)({ visibility })}
                        />
                    </ResourceAction>
                );
            default:
                return null;
        }
    }

    addUserPlugin = () => {
        const { id, onChange, stepData: stepDataProp } = this.props;
        const stepData = { ...stepDataProp };

        const getPluginName = (baseName = 'user-plugin', maxSuffixNumber = 1000) => {
            let pluginName = '';

            for (let pluginNameChosen = false, i = 0; i < maxSuffixNumber && !pluginNameChosen; i += 1) {
                pluginName = `${baseName}-${i}`;
                pluginNameChosen = !stepData[pluginName];
            }

            return pluginName;
        };

        const pluginName = getPluginName();
        stepData[pluginName] = { ...PluginsStepContent.defaultPluginState };
        stepData[pluginName].status = pluginStatuses.userDefinedPlugin;
        onChange(id, stepData);
    };

    handlePluginChange(pluginName) {
        const { id, onChange, stepData: stepDataProp } = this.props;
        return fields => {
            const stepData = { ...stepDataProp };
            stepData[pluginName] = { ...stepData[pluginName], ...fields };
            return onChange(id, { ...stepData });
        };
    }

    deleteUserPlugin(pluginName) {
        const { id, onChange, stepData: stepDataProp } = this.props;
        const stepData = { ..._.omit(stepDataProp, pluginName) };
        onChange(id, stepData);
    }

    isUserDefinedPlugin(pluginName) {
        const { stepData } = this.props;
        return _.isEqual(
            _.get(stepData[pluginName], 'status', pluginStatuses.unknown),
            pluginStatuses.userDefinedPlugin
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
                                                                onClick={() => this.deleteUserPlugin(pluginName)}
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
                <Form.Button content="Add plugin" icon="add" labelPosition="left" onClick={this.addUserPlugin} />
            </Form>
        );
    }
}

PluginsStepContent.propTypes = StepContentPropTypes;

export default createWizardStep(pluginsStepId, 'Plugins', 'Select plugins', PluginsStepContent, PluginsStepActions);
