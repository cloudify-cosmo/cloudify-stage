/**
 * Created by pposel on 06/02/2017.
 */

import RepositoryTable from './RepositoryTable';
import RepositoryCatalog from './RepositoryCatalog';
import UploadModal from './UploadModal';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            showModal: false,
            files: [],
            error: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
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
        this.props.toolbox.refresh(fetchParams);
    }

    _showModal(repo) {
        this.props.toolbox.loading(true);

        this.props.actions.doGetRepoTree(repo).then((files)=>{
            this.setState({files: {...files, repo}, showModal: true});
            this.props.toolbox.loading(false);
        }).catch((err)=> {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    render() {
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                {
                    this.props.widget.configuration.displayStyle === 'table' ?
                        <RepositoryTable
                            widget={this.props.widget} data={this.props.data}
                            fetchData={this._fetchData.bind(this)}
                            onSelect={this._selectItem.bind(this)}
                            onUpload={this._showModal.bind(this)}
                            />
                        :
                        <RepositoryCatalog
                            widget={this.props.widget} data={this.props.data}
                            fetchData={this._fetchData.bind(this)}
                            onSelect={this._selectItem.bind(this)}
                            onUpload={this._showModal.bind(this)}
                            />

                }

                <UploadModal open={this.state.showModal}
                             files={this.state.files}
                             onHide={this._hideModal.bind(this)}
                             toolbox={this.props.toolbox}
                             actions={this.props.actions}/>

            </div>

        );
    }
};
