import { without } from 'lodash';

import Consts from './consts';
import RepositoryCatalog from './RepositoryCatalog';
import RepositoryTable from './RepositoryTable';
import AuthenticationWarning from './AuthenticationWarning';
import UploadingMessage from './UploadingMessage';

import type {
    RepositoryViewProps,
    BlueprintCatalogPayload,
    BlueprintCatalogWidgetConfiguration,
    Blueprint
} from './types';
import Utils from './utils';
import type Actions from './actions';

const t = Utils.getWidgetTranslation();

interface RepositoryListProps {
    data: BlueprintCatalogPayload;
    widget: Stage.Types.Widget<BlueprintCatalogWidgetConfiguration>;
    toolbox: Stage.Types.Toolbox;
    actions: Actions;
}
interface RepositoryListState {
    uploadingBlueprint?: string;
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
        const selectedCatalogId = toolbox.getContext().getValue(Consts.CONTEXT_KEY.BLUEPRINT_CATALOG_ID);
        toolbox
            .getContext()
            .setValue(Consts.CONTEXT_KEY.BLUEPRINT_CATALOG_ID, item.id === selectedCatalogId ? null : item.id);
    };

    fetchData: RepositoryViewProps['fetchData'] = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    setUploadingBlueprint = (uploadingBlueprint: string) => {
        const { toolbox } = this.props;

        this.setState({ uploadingBlueprint: uploadingBlueprint });
        Utils.setUploadingBlueprintAcrossCatalogTabs(toolbox, uploadingBlueprint);
    };

    handleUpload: RepositoryViewProps['onUpload'] = (
        repositoryName,
        zipUrl,
        imageUrl,
        defaultYamlFile = Stage.Common.Consts.defaultBlueprintYamlFileName
    ) => {
        const { toolbox, widget } = this.props;
        const BlueprintActions = Stage.Common.Blueprints.Actions;

        this.setUploadingBlueprint(repositoryName);

        new BlueprintActions(toolbox)
            .doUpload(repositoryName, {
                blueprintYamlFile: defaultYamlFile,
                blueprintUrl: zipUrl,
                imageUrl: Stage.Utils.Url.url(imageUrl)
            })
            .then(() => {
                toolbox.drillDown(
                    widget,
                    'blueprint',
                    { blueprintId: repositoryName, openDeploymentModal: true },
                    repositoryName
                );
            })
            .catch(err => {
                this.setState(prevState => ({
                    errorMessages: [...(prevState.errorMessages ?? []), err.message]
                }));
            })
            .finally(() => {
                this.setState({
                    uploadingBlueprint: undefined
                });
            });
    };

    showReadmeModal: RepositoryViewProps['onReadme'] = (repositoryName, readmeUrl) => {
        const { actions } = this.props;

        this.setState({ readmeLoading: repositoryName });
        actions.doGetReadme(readmeUrl).then(content => {
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
            uploadingBlueprint,
            successMessages
        } = this.state;
        const { data, widget } = this.props;
        const { ReadmeModal } = Stage.Basic;
        const { FeedbackMessages } = Stage.Common.Components;
        const isUploadingBlueprint = !!uploadingBlueprint;

        const showNotAuthenticatedWarning = data.source === Consts.GITHUB_DATA_SOURCE && !data.isAuthenticated;

        const RepositoryView = widget.configuration.displayStyle === 'table' ? RepositoryTable : RepositoryCatalog;

        if (isUploadingBlueprint) {
            return <UploadingMessage blueprintName={uploadingBlueprint!} />;
        }

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
                {showNotAuthenticatedWarning && <AuthenticationWarning />}
                <RepositoryView
                    widget={widget}
                    data={data}
                    fetchData={this.fetchData}
                    onSelect={this.selectItem}
                    onUpload={this.handleUpload}
                    onReadme={this.showReadmeModal}
                    readmeLoading={readmeLoading}
                    noDataMessage={t('noDataMessage')}
                />

                <ReadmeModal open={showReadmeModal} content={readmeContent} onHide={this.hideReadmeModal} />
            </div>
        );
    }
}
