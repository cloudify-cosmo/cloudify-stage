/**
 * Created by pposel on 06/02/2017.
 */

import Consts from './consts';
import RepositoryCatalog from './RepositoryCatalog';
import RepositoryTable from './RepositoryTable';
import UploadModal from './UploadModal';
import DataPropType from './props/DataPropType';
import ActionsPropType from './props/ActionsPropType';

export default class RepositoryList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
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

    showModal = (repositoryName, zipUrl, imageUrl, defaultYamlFile = '') => {
        const { actions, toolbox } = this.props;
        toolbox.loading(true);

        actions
            .doListYamlFiles(zipUrl)
            .then(yamlFiles => {
                this.setState({
                    error: null,
                    repositoryName,
                    defaultYamlFile,
                    yamlFiles,
                    zipUrl,
                    imageUrl,
                    showModal: true
                });
                toolbox.loading(false);
            })
            .catch(err => {
                this.setState({ error: err.message });
                toolbox.loading(false);
            });
    };

    hideModal = () => {
        this.setState({ showModal: false });
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
            imageUrl,
            readmeContent,
            readmeLoading,
            repositoryName,
            showModal,
            showReadmeModal,
            defaultYamlFile,
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
                    (~50). Fix this by adding &amp;github-username&amp; and &amp;github-password&amp; entries to your
                    secrets store (Secrets widget).
                </span>
            </Message>
        );

        const showNotAuthenticatedWarning = data.source === Consts.GITHUB_DATA_SOURCE && !data.isAuthenticated;

        const RepositoryView = widget.configuration.displayStyle === 'table' ? RepositoryTable : RepositoryCatalog;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                {showNotAuthenticatedWarning && notAuthenticatedWarning}
                <RepositoryView
                    widget={widget}
                    data={data}
                    fetchData={this.fetchData}
                    onSelect={this.selectItem}
                    onUpload={this.showModal}
                    onReadme={this.showReadmeModal}
                    readmeLoading={readmeLoading}
                    noDataMessage={NO_DATA_MESSAGE}
                />

                <UploadModal
                    open={showModal}
                    repositoryName={repositoryName}
                    yamlFiles={yamlFiles}
                    defaultYamlFile={defaultYamlFile}
                    zipUrl={zipUrl}
                    imageUrl={imageUrl}
                    onHide={this.hideModal}
                    toolbox={toolbox}
                    actions={actions}
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
