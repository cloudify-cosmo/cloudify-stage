/**
 * Created by jakubniezgoda on 24/03/2017.
 */

import CreateModal from './CreateModal';
import UpdateModal from './UpdateModal';

export default class SecretsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            secret: {},
            canShowSecret: true,
            showSecretKey: '',
            showSecretValue: '',
            showSecretLoading: false
        };
    }

    static CREATE_SECRET_ACTION = 'create';

    static DELETE_SECRET_ACTION = 'delete';

    static UPDATE_SECRET_ACTION = 'update';

    shouldComponentUpdate(nextProps, nextState) {
        const { data, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(data, nextProps.data)
        );
    }

    refreshData() {
        this.setState({ error: null });
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('secrets:refresh', this.refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('secrets:refresh', this.refreshData);
    }

    fetchGridData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    onDeleteSecret(secret) {
        this.setState({ secret, modalType: SecretsTable.DELETE_SECRET_ACTION, showModal: true });
    }

    onUpdateSecret(secret) {
        this.setState({
            secret,
            modalType: SecretsTable.UPDATE_SECRET_ACTION,
            showModal: true,
            showSecretKey: '',
            showSecretValue: ''
        });
    }

    onShowSecret(secret) {
        const secretKey = secret.key;
        this.setState({ secret, showSecretKey: secretKey, showSecretValue: '', showSecretLoading: true });

        const actions = new Stage.Common.SecretActions(this.props.toolbox);
        actions
            .doGet(secretKey)
            .then(secret => {
                let canShowSecret = true;
                if (secret.is_hidden_value && _.isEmpty(secret.value)) {
                    canShowSecret = false;
                }
                this.setState({ showSecretValue: secret.value, showSecretLoading: false, error: null, canShowSecret });
            })
            .catch(err => {
                this.setState({ showSecretLoading: false, error: err.message });
            });
    }

    onHideSecret() {
        this.setState({ showSecretKey: '', showSecretValue: '' });
    }

    deleteSecret() {
        const { toolbox } = this.props;
        const secretKey = this.state.secret.key;
        const actions = new Stage.Common.SecretActions(toolbox);
        const HIDE_DELETE_MODAL_STATE = { modalType: SecretsTable.DELETE_SECRET_ACTION, showModal: false };

        actions
            .doDelete(secretKey)
            .then(() => {
                this.setState({ ...HIDE_DELETE_MODAL_STATE, error: null });
                toolbox.getEventBus().trigger('secrets:refresh');
            })
            .catch(err => {
                this.setState({ ...HIDE_DELETE_MODAL_STATE, error: err.message });
            });
    }

    setSecretVisibility(secretKey, visibility) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.SecretActions(toolbox);
        toolbox.loading(true);
        actions
            .doSetVisibility(secretKey, visibility)
            .then(() => {
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                toolbox.loading(false);
                this.setState({ error: err.message });
            });
    }

    onIsHiddenValueChange(secretKey, isHiddenValue) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.SecretActions(toolbox);
        toolbox.loading(true);
        actions
            .doSetIsHiddenValue(secretKey, isHiddenValue)
            .then(() => {
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                toolbox.loading(false);
                this.setState({ error: err.message });
            });
    }

    hideModal() {
        this.setState({ showModal: false });
    }

    render() {
        const {
            canShowSecret,
            error,
            modalType,
            secret,
            showModal,
            showSecretKey,
            showSecretLoading,
            showSecretValue
        } = this.state;
        const NO_DATA_MESSAGE = 'There are no Secrets available. Click "Create" to create Secrets.';
        const { Checkbox, DataTable, ErrorMessage, Icon, Popup, ResourceVisibility } = Stage.Basic;
        const DeleteModal = Stage.Basic.Confirm;
        const { data, toolbox, widget } = this.props;
        const currentUsername = toolbox.getManager().getCurrentUsername();
        const selectedTenant = toolbox.getManager().getSelectedTenant();

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData.bind(this)}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    searchable
                    className="secretsTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label="Key" name="key" width="20%" />
                    <DataTable.Column label="Value" width="20%" />
                    <DataTable.Column label="Hidden Value" name="is_hidden_value" width="10%" />
                    <DataTable.Column label="Created" name="created_at" width="10%" />
                    <DataTable.Column label="Updated" name="updated_at" width="10%" />
                    <DataTable.Column label="Creator" name="created_by" width="10%" />
                    <DataTable.Column label="Tenant" name="tenant_name" width="10%" />
                    <DataTable.Column width="10%" />

                    {data.items.map(secret => {
                        return (
                            <DataTable.Row key={secret.key}>
                                <DataTable.Data>
                                    {secret.key}
                                    <ResourceVisibility
                                        visibility={secret.visibility}
                                        onSetVisibility={visibility => {
                                            this.setSecretVisibility(secret.key, visibility);
                                        }}
                                        allowedSettingTo={['tenant', 'global']}
                                        className="rightFloated"
                                    />
                                </DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    {showSecretKey === secret.key ? (
                                        showSecretLoading ? (
                                            <Icon name="spinner" loading />
                                        ) : canShowSecret ? (
                                            <div>
                                                <pre className="forceMaxWidth">{showSecretValue}</pre>
                                                <Icon
                                                    bordered
                                                    link
                                                    name="hide"
                                                    title="Hide secret value"
                                                    onClick={this.onHideSecret.bind(this)}
                                                />
                                            </div>
                                        ) : (
                                            <Popup position="top right" on="hover">
                                                <Popup.Trigger>
                                                    <Icon bordered name="dont" color="red" />
                                                </Popup.Trigger>
                                                User `{currentUsername}` is not permitted to show the secret `
                                                {secret.key}` in the tenant `{selectedTenant}` .
                                            </Popup>
                                        )
                                    ) : (
                                        <Icon
                                            bordered
                                            link
                                            name="unhide"
                                            title="Show secret value"
                                            onClick={this.onShowSecret.bind(this, secret)}
                                        />
                                    )}
                                </DataTable.Data>
                                <DataTable.Data className="center aligned">
                                    <Checkbox
                                        checked={secret.is_hidden_value}
                                        onChange={() => this.onIsHiddenValueChange(secret.key, !secret.is_hidden_value)}
                                        onClick={e => e.stopPropagation()}
                                    />
                                    {secret.is_hidden_value}
                                </DataTable.Data>
                                <DataTable.Data>{secret.created_at}</DataTable.Data>
                                <DataTable.Data>{secret.updated_at}</DataTable.Data>
                                <DataTable.Data>{secret.created_by}</DataTable.Data>
                                <DataTable.Data>{secret.tenant_name}</DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <Icon
                                        bordered
                                        link
                                        name="edit"
                                        title="Update secret"
                                        onClick={this.onUpdateSecret.bind(this, secret)}
                                    />
                                    <Icon
                                        bordered
                                        link
                                        name="trash"
                                        title="Delete secret"
                                        onClick={this.onDeleteSecret.bind(this, secret)}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}

                    <DataTable.Action>
                        <CreateModal toolbox={toolbox} />
                    </DataTable.Action>
                </DataTable>

                <DeleteModal
                    content={`Are you sure you want to delete secret '${secret.key}'?`}
                    open={modalType === SecretsTable.DELETE_SECRET_ACTION && showModal}
                    onConfirm={this.deleteSecret.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                />

                <UpdateModal
                    toolbox={toolbox}
                    open={modalType === SecretsTable.UPDATE_SECRET_ACTION && showModal}
                    onHide={this.hideModal.bind(this)}
                    secret={secret}
                />
            </div>
        );
    }
}
