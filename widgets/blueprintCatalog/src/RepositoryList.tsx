import { without } from 'lodash';

import Consts from './consts';
import RepositoryCatalog from './RepositoryCatalog';
import RepositoryTable from './RepositoryTable';

import type { BlueprintCatalogPayload, BlueprintCatalogWidgetConfiguration, Blueprint } from './types';
import type Actions from './actions';

import { RepositoryViewProps } from './types';

interface RepositoryListProps {
    data: BlueprintCatalogPayload;
    widget: Stage.Types.Widget<BlueprintCatalogWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;
    actions: Actions;
}
interface RepositoryListState {
    uploadingBlueprints: string[];
    successMessages: string[];
    errorMessages: string[] | null;
    showReadmeModal: boolean;
    readmeContent: string;
    readmeLoading: string | null;
    repositoryName: string;
    yamlFiles: string[];
    defaultYamlFile: string;
    zipUrl: string;
    imageUrl: string;
}

export default class RepositoryList extends React.Component<RepositoryListProps, RepositoryListState> {
    constructor(props: RepositoryListProps) {
        super(props);

        this.state = {
            uploadingBlueprints: [],
            successMessages: [],
            errorMessages: null,
            showReadmeModal: false,
            readmeContent: '',
            readmeLoading: null,
            repositoryName: '',
            yamlFiles: [],
            defaultYamlFile: '',
            zipUrl: '',
            imageUrl: ''
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('blueprintCatalog:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: RepositoryListProps, nextState: RepositoryListState) {
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

    selectItem = (item: Blueprint) => {
        const { toolbox } = this.props;
        const selectedCatalogId = toolbox.getContext().getValue('blueprintCatalogId');
        toolbox.getContext().setValue('blueprintCatalogId', item.id === selectedCatalogId ? null : item.id);
    };

    fetchData: RepositoryViewProps['fetchData'] = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    handleUpload: RepositoryViewProps['onUpload'] = (
        repositoryName,
        zipUrl,
        imageUrl,
        defaultYamlFile = Stage.Common.Consts.defaultBlueprintYamlFileName
    ) => {
        const { toolbox, widget } = this.props;
        const { BlueprintActions } = Stage.Common;
        const { uploadingBlueprints } = this.state;
        this.setState({ uploadingBlueprints: [...uploadingBlueprints, repositoryName] });

        new BlueprintActions(toolbox)
            .doUpload(repositoryName, {
                blueprintYamlFile: defaultYamlFile,
                blueprintUrl: zipUrl,
                imageUrl: Stage.Utils.Url.url(imageUrl)
            })
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

    showReadmeModal: RepositoryViewProps['onReadme'] = (repositoryName, readmeUrl) => {
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
            errorMessages,
            readmeContent,
            readmeLoading,
            showReadmeModal,
            uploadingBlueprints,
            successMessages
        } = this.state;
        const { data, widget } = this.props;
        const NO_DATA_MESSAGE = "There are no Blueprints available in catalog. Check widget's configuration.";
        const { Message, Icon, ReadmeModal } = Stage.Basic;
        const { FeedbackMessages } = Stage.Common;

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
                <FeedbackMessages
                    successMessages={successMessages}
                    onDismissSuccess={message =>
                        this.setState(prevState => ({
                            successMessages: without(prevState.successMessages, message)
                        }))
                    }
                    errorMessages={errorMessages}
                    onDismissErrors={() => this.setState({ errorMessages: null })}
                />
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

                <ReadmeModal open={showReadmeModal} content={readmeContent} onHide={this.hideReadmeModal} />
            </div>
        );
    }
}
