/**
 * Created by jakubniezgoda on 24/03/2017.
 */

import CreateModal from './CreateModal';
import UpdateModal from './UpdateModal';
import Actions from './actions';

export default class SecretsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            secret: {},
            showSecretKey: '',
            showSecretValue: '',
            showSecretLoading: false
        }
    }

    static CREATE_SECRET_ACTION = 'create';
    static DELETE_SECRET_ACTION = 'delete';
    static UPDATE_SECRET_ACTION = 'update';

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.widget !== nextProps.widget
            || this.state != nextState
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _refreshData() {
        this.setState({error: null});
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('secrets:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('secrets:refresh', this._refreshData);
    }

    fetchGridData(fetchParams) {
        this.props.toolbox.refresh(fetchParams);
    }

    _onDeleteSecret(secret) {
        this.setState({secret, modalType: SecretsTable.DELETE_SECRET_ACTION, showModal: true});
    }

    _onUpdateSecret(secret) {
        this.setState({secret, modalType: SecretsTable.UPDATE_SECRET_ACTION, showModal: true, showSecretKey: '', showSecretValue: ''});
    }

    _onShowSecret(secret) {
        let secretKey = secret.key;
        this.setState({secret, showSecretKey: secretKey, showSecretValue: '', showSecretLoading: true});

        let actions = new Actions(this.props.toolbox);
        actions.doGet(secretKey).then((secret)=>{
            this.setState({showSecretValue: secret.value, showSecretLoading: false, error: null});
            this.props.toolbox.getEventBus().trigger('secrets:refresh');
        }).catch((err)=> {
            this.setState({showSecretLoading: false, error: err.message});
        });
    }

    _onHideSecret() {
        this.setState({showSecretKey: '', showSecretValue: ''});
    }

    _deleteSecret() {
        let secretKey = this.state.secret.key;
        let actions = new Actions(this.props.toolbox);
        const HIDE_DELETE_MODAL_STATE = {modalType: SecretsTable.DELETE_SECRET_ACTION, showModal: false};

        actions.doDelete(secretKey).then(()=>{
            this.setState({...HIDE_DELETE_MODAL_STATE, error: null});
            this.props.toolbox.getEventBus().trigger('secrets:refresh');
        }).catch((err)=> {
            this.setState({...HIDE_DELETE_MODAL_STATE, error: err.message});
        });
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    render() {
        let {ErrorMessage, DataTable, Icon, Label} = Stage.Basic;
        let DeleteModal = Stage.Basic.Confirm;
        let data = this.props.data;

        return (
            <div>
                <ErrorMessage error={this.state.error}/>

                <DataTable fetchData={this.fetchGridData.bind(this)}
                           totalSize={data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           className="secretsTable">

                    <DataTable.Column label="Key" name="key" width="20%" />
                    <DataTable.Column label="Value" width="20%" />
                    <DataTable.Column label="Created" name="created_at" width="10%" />
                    <DataTable.Column label="Updated" name="updated_at" width="10%" />
                    <DataTable.Column label="Creator" name='created_by' width="15%" />
                    <DataTable.Column label="Tenant" name="tenant_name" width="15%" />
                    <DataTable.Column width="10%" />

                    {
                        data.items.map((secret)=>{
                            return (
                                <DataTable.Row key={secret.key}>
                                    <DataTable.Data>{secret.key}</DataTable.Data>
                                    <DataTable.Data className="center aligned rowActions">
                                        {
                                            this.state.showSecretKey === secret.key
                                                ? this.state.showSecretLoading
                                                    ? <Icon name="spinner" loading />
                                                    : <div>
                                                        <Label>{this.state.showSecretValue}</Label>
                                                        <Icon bordered link name="hide" title="Hide secret valeu" onClick={this._onHideSecret.bind(this)} />
                                                      </div>
                                                : <Icon bordered link name="unhide" title="Show secret value" onClick={this._onShowSecret.bind(this, secret)} />
                                        }
                                    </DataTable.Data>
                                    <DataTable.Data>{secret.created_at}</DataTable.Data>
                                    <DataTable.Data>{secret.updated_at}</DataTable.Data>
                                    <DataTable.Data>{secret.created_by}</DataTable.Data>
                                    <DataTable.Data>{secret.tenant_name}</DataTable.Data>
                                    <DataTable.Data className="center aligned rowActions">
                                        <Icon bordered link name="edit" title="Update secret" onClick={this._onUpdateSecret.bind(this, secret)} />
                                        <Icon bordered link name="trash" title="Delete secret" onClick={this._onDeleteSecret.bind(this, secret)} />
                                    </DataTable.Data>
                                </DataTable.Row>
                            );
                        })
                    }

                    <DataTable.Action>
                        <CreateModal toolbox={this.props.toolbox}/>
                    </DataTable.Action>

                </DataTable>

                <DeleteModal content={`Are you sure you want to delete secret '${this.state.secret.key}'?`}
                             open={this.state.modalType === SecretsTable.DELETE_SECRET_ACTION && this.state.showModal}
                             onConfirm={this._deleteSecret.bind(this)}
                             onCancel={this._hideModal.bind(this)}/>

                <UpdateModal toolbox={this.props.toolbox}
                             open={this.state.modalType === SecretsTable.UPDATE_SECRET_ACTION && this.state.showModal}
                             onHide={this._hideModal.bind(this)}
                             secret={this.state.secret} />
            </div>
        );
    }
}
