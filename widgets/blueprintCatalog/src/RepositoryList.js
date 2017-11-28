/**
 * Created by pposel on 06/02/2017.
 */

import RepositoryTable from './RepositoryTable';
import RepositoryCatalog from './RepositoryCatalog';
import UploadModal from './UploadModal';
import ReadmeModal from './ReadmeModal';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            showModal: false,
            showReadmeModal: false,
            readmeContent: null,
            readmeLoading: null,
            files: [],
            error: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _selectItem(item){
        var selectedCatalogId = this.props.toolbox.getContext().getValue('blueprintCatalogId');
        this.props.toolbox.getContext().setValue('blueprintCatalogId',item.id === selectedCatalogId ? null : item.id);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('blueprintCatalog:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('blueprintCatalog:refresh',this._refreshData);
    }

    _fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    _showModal(repo) {
        this.props.toolbox.loading(true);

        this.props.actions.doGetRepoTree(repo).then((files)=>{
            this.setState({error: null, files: {...files, repo}, showModal: true});
            this.props.toolbox.loading(false);
        }).catch((err)=> {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _showReadmeModal(repo) {
        this.setState({readmeLoading: repo});
        this.props.actions.doGetReadme(repo).then(content => {
            this.setState({readmeContent: markdown.parse(content), showReadmeModal: true, readmeLoading: null});
        });
    }

    _hideReadmeModal() {
        this.setState({showReadmeModal: false});
    }

    _onErrorDismiss() {
        this.setState({error: null});
    }

    render() {
        let {ErrorMessage, Message, Icon} = Stage.Basic;

        let notAuthenticatedWarning = (
            <Message>
                <Icon name="ban" />
                <span>
                    No GitHub credentials provided! Widget may stop working after reaching unrestricted query limit (~50).
                    Fix this by adding 'github-username' and 'github-password' entries to your secrets store (Secrets widget).
                </span>
            </Message>);

        return (
            <div>
                {this.props.data.isAuthenticated ? '' :notAuthenticatedWarning}
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                {
                    this.props.widget.configuration.displayStyle === 'table' ?
                        <RepositoryTable
                            widget={this.props.widget} data={this.props.data}
                            fetchData={this._fetchData.bind(this)}
                            onSelect={this._selectItem.bind(this)}
                            onUpload={this._showModal.bind(this)}
                            onReadme={this._showReadmeModal.bind(this)}
                            readmeLoading={this.state.readmeLoading}
                            />
                        :
                        <RepositoryCatalog
                            widget={this.props.widget} data={this.props.data}
                            fetchData={this._fetchData.bind(this)}
                            onSelect={this._selectItem.bind(this)}
                            onUpload={this._showModal.bind(this)}
                            onReadme={this._showReadmeModal.bind(this)}
                            readmeLoading={this.state.readmeLoading}
                            />

                }

                <UploadModal open={this.state.showModal}
                             files={this.state.files}
                             onHide={this._hideModal.bind(this)}
                             toolbox={this.props.toolbox}
                             actions={this.props.actions}/>

                <ReadmeModal open={this.state.showReadmeModal}
                             content={this.state.readmeContent}
                             onHide={this._hideReadmeModal.bind(this)}
                             toolbox={this.props.toolbox}
                             actions={this.props.actions}/>

            </div>

        );
    }
};
