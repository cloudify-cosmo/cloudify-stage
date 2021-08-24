// @ts-nocheck File not migrated fully to TS
/**
 * Created by pposel on 06/02/2017.
 */

import isEmpty from 'lodash/isEmpty';

import Consts from './consts';
import RepositoryCatalog from './RepositoryCatalog';
import RepositoryTable from './RepositoryTable';
import DataPropType from './props/DataPropType';
import ActionsPropType from './props/ActionsPropType';

const t = Stage.Utils.getT('widgets.blueprintCatalog');

export default class RepositoryList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            uploadingBlueprints: [],
            successMessages: [],
            errorMessage: null,
            showModal: false,
            showReadmeModal: false,
            readmeContent: '',
            readmeLoading: null,
            repositoryName: '',
            yamlFiles: [],
            defaultYamlFile: '',
            zipUrl: '',
            imageUrl: '',
            error: null
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('blueprintCatalog:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('blueprintCatalog:refresh', this.refreshData);
    }

    selectItem = item => {
        const { toolbox } = this.props;
        const selectedCatalogId = toolbox.getContext().getValue('blueprintCatalogId');
        toolbox.getContext().setValue('blueprintCatalogId', item.id === selectedCatalogId ? null : item.id);
    };

    fetchData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    handleUpload = (repositoryName, zipUrl, imageUrl, defaultYamlFile = 'blueprint.yaml') => {
        const { toolbox, widget } = this.props;
        const { BlueprintActions } = Stage.Common;
        const { uploadingBlueprints } = this.state;
        this.setState({ uploadingBlueprints: [...uploadingBlueprints, repositoryName] });

        new BlueprintActions(toolbox)
            .doUpload(
                repositoryName,
                defaultYamlFile,
                zipUrl,
                null,
                Stage.Utils.Url.url(imageUrl),
                null,
                Stage.Common.Consts.defaultVisibility
            )
            .then(() => {
                toolbox.drillDown(widget, 'blueprint', { blueprintId: repositoryName }, repositoryName);
            })
            .catch(err => {
                this.setState(prevState => ({
                    errorMessages: [...(prevState.errorMessages ?? []), err.message],
                    uploadingBlueprints: prevState.uploadingBlueprints.filter(item => item !== repositoryName)
                }));
            });
    };

    showReadmeModal = (repositoryName, readmeUrl) => {
        const { actions } = this.props;

        this.setState({ readmeLoading: repositoryName });
        actions.doGetReadme(repositoryName, readmeUrl).then(content => {
            this.setState({
                readmeContent: Stage.Utils.parseMarkdown(content) || '',
                showReadmeModal: true,
                readmeLoading: null
            });
        });
    };

    hideReadmeModal = () => {
        this.setState({ showReadmeModal: false });
    };

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    render() {
        const {
            error,
            readmeContent,
            readmeLoading,
            showReadmeModal,
            uploadingBlueprints,
            successMessages,
            errorMessages
        } = this.state;
        const { actions, data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = "There are no Blueprints available in catalog. Check widget's configuration.";
        const { ErrorMessage, Message, Icon, ReadmeModal } = Stage.Basic;

        const notAuthenticatedWarning = (
            <Message>
                <Icon name="ban" />
                <span>
                    No GitHub credentials provided! Widget may stop working after reaching unrestricted query limit
                    (~50). Fix this by adding &amp;github-username&amp; and &amp;github-password&amp; entries to your
                    secrets store (Secrets widget).
                </span>
            </Message>
        );

        const showNotAuthenticatedWarning = data.source === Consts.GITHUB_DATA_SOURCE && !data.isAuthenticated;

        const RepositoryView = widget.configuration.displayStyle === 'table' ? RepositoryTable : RepositoryCatalog;

        return (
            <div>
                {successMessages.map(message => (
                    <Message
                        key={message}
                        success
                        onDismiss={() =>
                            this.setState(prevState => ({
                                successMessages: without(prevState.successMessages, message)
                            }))
                        }
                    >
                        {message}
                    </Message>
                ))}
                {!isEmpty(errorMessages) && (
                    <ErrorMessage error={errorMessages} onDismiss={() => this.setState({ errorMessages: null })} />
                )}

                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                {showNotAuthenticatedWarning && notAuthenticatedWarning}
                <RepositoryView
                    widget={widget}
                    data={data}
                    uploadingInProgress={uploadingBlueprints}
                    fetchData={this.fetchData}
                    onSelect={this.selectItem}
                    onUpload={this.handleUpload}
                    onReadme={this.showReadmeModal}
                    readmeLoading={readmeLoading}
                    noDataMessage={NO_DATA_MESSAGE}
                />

                <ReadmeModal
                    open={showReadmeModal}
                    content={readmeContent}
                    onHide={this.hideReadmeModal}
                    toolbox={toolbox}
                    actions={actions}
                />
            </div>
        );
    }
}

RepositoryList.propTypes = {
    actions: ActionsPropType.isRequired,
    data: DataPropType.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
