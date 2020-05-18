/**
 * Created by pposel on 06/02/2017.
 */

import RepositoryTable from './RepositoryTable';
import RepositoryCatalog from './RepositoryCatalog';
import UploadModal from './UploadModal';
import Consts from './consts';

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
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    selectItem(item) {
        const selectedCatalogId = this.props.toolbox.getContext().getValue('blueprintCatalogId');
        this.props.toolbox.getContext().setValue('blueprintCatalogId', item.id === selectedCatalogId ? null : item.id);
    }

    refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('blueprintCatalog:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('blueprintCatalog:refresh', this.refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    showModal(repositoryName, zipUrl, imageUrl) {
        this.props.toolbox.loading(true);

        this.props.actions
            .doListYamlFiles(zipUrl)
            .then(yamlFiles => {
                this.setState({ error: null, repositoryName, yamlFiles, zipUrl, imageUrl, showModal: true });
                this.props.toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                this.props.toolbox.loading(false);
            });
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    showReadmeModal(repositoryName, readmeUrl) {
        this.setState({ readmeLoading: repositoryName });
        this.props.actions.doGetReadme(repositoryName, readmeUrl).then(content => {
            this.setState({ readmeContent: markdown.parse(content) || '', showReadmeModal: true, readmeLoading: null });
        });
    }

    hideReadmeModal() {
        this.setState({ showReadmeModal: false });
    }

    render() {
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

        const showNotAuthenticatedWarning =
            this.props.data.source === Consts.GITHUB_DATA_SOURCE && !this.props.data.isAuthenticated;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                {showNotAuthenticatedWarning && notAuthenticatedWarning}
                {this.props.widget.configuration.displayStyle === 'table' ? (
                    <RepositoryTable
                        widget={this.props.widget}
                        data={this.props.data}
                        fetchData={this.fetchData.bind(this)}
                        onSelect={this.selectItem.bind(this)}
                        onUpload={this.showModal.bind(this)}
                        onReadme={this.showReadmeModal.bind(this)}
                        readmeLoading={this.state.readmeLoading}
                        noDataMessage={NO_DATA_MESSAGE}
                    />
                ) : (
                    <RepositoryCatalog
                        widget={this.props.widget}
                        data={this.props.data}
                        fetchData={this.fetchData.bind(this)}
                        onSelect={this.selectItem.bind(this)}
                        onUpload={this.showModal.bind(this)}
                        onReadme={this.showReadmeModal.bind(this)}
                        readmeLoading={this.state.readmeLoading}
                        noDataMessage={NO_DATA_MESSAGE}
                    />
                )}

                <UploadModal
                    open={this.state.showModal}
                    repositoryName={this.state.repositoryName}
                    yamlFiles={this.state.yamlFiles}
                    zipUrl={this.state.zipUrl}
                    imageUrl={this.state.imageUrl}
                    onHide={this.hideModal.bind(this)}
                    toolbox={this.props.toolbox}
                    actions={this.props.actions}
                />

                <ReadmeModal
                    open={this.state.showReadmeModal}
                    content={this.state.readmeContent}
                    onHide={this.hideReadmeModal.bind(this)}
                    toolbox={this.props.toolbox}
                    actions={this.props.actions}
                />
            </div>
        );
    }
}
