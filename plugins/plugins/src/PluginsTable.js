/**
 * Created by kinneretzin on 02/10/2016.
 */

import Actions from './actions';

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            confirmDelete:false
        }
    }

    _selectPlugin (item){
        var oldSelectedPluginId = this.props.context.getValue('pluginId');
        this.props.context.setValue('pluginId',item.id === oldSelectedPluginId ? null : item.id);
    }

    _deletePluginConfirm(item,event){
        event.stopPropagation();

        this.setState({
            confirmDelete : true,
            item: item
        });
    }

    _downloadPlugin(item,event) {
        event.stopPropagation();

        window.open(this.props.context.getManager().getManagerUrl(`/plugins/${item.id}/archive`));
    }

    _deletePlugin() {
        if (!this.state.item) {
            this.setState({error: 'Something went wrong, no plugin was selected for delete'});
            return;
        }

        var actions = new Actions(this.props.context);
        actions.doDelete(this.state.item)
            .then(()=> {
                this.setState({confirmDelete: false});
                this.props.context.getEventBus().trigger('plugins:refresh');
            })
            .catch(err=>{
                this.setState({confirmDelete: false, error: err.error});
            });
    }

    _refreshData() {
        this.props.context.refresh();
    }

    componentDidMount() {
        this.props.context.getEventBus().on('plugins:refresh',this._refreshData,this);
    }

    componentWillUnmount() {
        this.props.context.getEventBus().off('plugins:refresh',this._refreshData);
    }

    render() {
        var Confirm = Stage.Basic.Confirm;
        var ErrorMessage = Stage.Basic.ErrorMessage;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <table className="ui very compact table pluginsTable">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Package name</th>
                        <th>Package version</th>
                        <th>Supported platform</th>
                        <th>Distribution</th>
                        <th>Distribute release</th>
                        <th>Uploaded at</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.data.items.map((item)=>{
                            return (
                                <tr key={item.id} className={"row "+ (item.isSelected ? 'active' : '')} onClick={this._selectPlugin.bind(this,item)}>
                                    <td>
                                        <div>
                                            <a className='pluginName' href="javascript:void(0)">{item.id}</a>
                                        </div>
                                    </td>
                                    <td>{item.package_name}</td>
                                    <td>{item.package_version}</td>
                                    <td>{item.supported_platform}</td>
                                    <td>{item.distribution}</td>
                                    <td>{item.distribution_release}</td>
                                    <td>{item.uploaded_at}</td>
                                    <td>
                                        <div className="rowActions">
                                            <i className="download icon link bordered" title="Download" onClick={this._downloadPlugin.bind(this,item)}></i>
                                            <i className="trash icon link bordered" title="Delete" onClick={this._deletePluginConfirm.bind(this,item)}></i>
                                        </div>
                                    </td>
                            </tr>
                            );
                        })
                    }
                    </tbody>
                </table>

                <Confirm title='Are you sure you want to remove this plugin?'
                         show={this.state.confirmDelete}
                         onConfirm={this._deletePlugin.bind(this)}
                         onCancel={()=>this.setState({confirmDelete : false})} />
            </div>

        );
    }
};
