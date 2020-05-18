/**
 * Created by pposel on 06/02/2017.
 */

import Consts from './consts';
import RepositoryCatalog from './RepositoryCatalog';
import RepositoryTable from './RepositoryTable';
import UploadModal from './UploadModal';

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false,
            showReadmeModal: false,
            readmeContent: '',
            readmeLoading: null,
            repositoryName: '',
            yamlFiles: [],
            zipUrl: '',
            imageUrl: '',
            error: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    selectItem(item) {
        const { toolbox } = this.props;
        const selectedCatalogId = toolbox.getContext().getValue('blueprintCatalogId');
        toolbox.getContext().setValue('blueprintCatalogId', item.id === selectedCatalogId ? null : item.id);
    }

    refreshData() {
        const { toolbox } = this.props;
        toolbox.refresh();
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('blueprintCatalog:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('blueprintCatalog:refresh', this.refreshData);
    }

    fetchData(fetchParams) {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    }

    showModal(repositoryName, zipUrl, imageUrl) {
        const { actions, toolbox } = this.props;
        toolbox.loading(true);

        actions
            .doListYamlFiles(zipUrl)
            .then(yamlFiles => {
                this.setState({ error: null, repositoryName, yamlFiles, zipUrl, imageUrl, showModal: true });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    showReadmeModal(repositoryName, readmeUrl) {
        const { actions } = this.props;

        this.setState({ readmeLoading: repositoryName });
        actions.doGetReadme(repositoryName, readmeUrl).then(content => {
            this.setState({ readmeContent: markdown.parse(content) || '', showReadmeModal: true, readmeLoading: null });
        });
    }

    hideReadmeModal() {
        this.setState({ showReadmeModal: false });
    }

    render() {
        const {
            error,
            imageUrl,
            readmeContent,
            readmeLoading,
            repositoryName,
            showModal,
            showReadmeModal,
            yamlFiles,
            zipUrl
        } = this.state;
        const { actions, data, toolbox, widget } = this.props;
        const NO_DATA_MESSAGE = "There are no Blueprints available in catalog. Check widget's configuration.";
        const { ErrorMessage, Message, Icon, ReadmeModal } = Stage.Basic;

        const notAuthenticatedWarning = (
            <Message>
                <Icon name="ban" />
                <span>
                    No GitHub credentials provided! Widget may stop working after reaching unrestricted query limit
                    (~50). Fix this by adding 'github-username' and 'github-password' entries to your secrets store
                    (Secrets widget).
                </span>
            </Message>
        );

        const showNotAuthenticatedWarning = data.source === Consts.GITHUB_DATA_SOURCE && !data.isAuthenticated;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                {showNotAuthenticatedWarning && notAuthenticatedWarning}
                {widget.configuration.displayStyle === 'table' ? (
                    <RepositoryTable
                        widget={widget}
                        data={data}
                        fetchData={this.fetchData.bind(this)}
                        onSelect={this.selectItem.bind(this)}
                        onUpload={this.showModal.bind(this)}
                        onReadme={this.showReadmeModal.bind(this)}
                        readmeLoading={readmeLoading}
                        noDataMessage={NO_DATA_MESSAGE}
                    />
                ) : (
                    <RepositoryCatalog
                        widget={widget}
                        data={data}
                        fetchData={this.fetchData.bind(this)}
                        onSelect={this.selectItem.bind(this)}
                        onUpload={this.showModal.bind(this)}
                        onReadme={this.showReadmeModal.bind(this)}
                        readmeLoading={readmeLoading}
                        noDataMessage={NO_DATA_MESSAGE}
                    />
                )}

                <UploadModal
                    open={showModal}
                    repositoryName={repositoryName}
                    yamlFiles={yamlFiles}
                    zipUrl={zipUrl}
                    imageUrl={imageUrl}
                    onHide={this.hideModal.bind(this)}
                    toolbox={toolbox}
                    actions={actions}
                />

                <ReadmeModal
                    open={showReadmeModal}
                    content={readmeContent}
                    onHide={this.hideReadmeModal.bind(this)}
                    toolbox={toolbox}
                    actions={actions}
                />
            </div>
        );
    }
}
