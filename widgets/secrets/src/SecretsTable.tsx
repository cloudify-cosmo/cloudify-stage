import { isEmpty, isEqual } from 'lodash';
import type { FetchParams, Visibility } from 'app/widgets/common/types';
import type { Secret } from 'app/widgets/common/secrets/SecretActions';
import type { SecretsWidget } from './widget.types';
import CreateModal from './CreateModal';
import UpdateModal from './UpdateModal';
import SecretValue from './SecretValue';
import { translateSecrets } from './widget.utils';

export interface SecretsTableProps {
    data: {
        items: Secret[];
        total: number;
    };
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<SecretsWidget.Configuration>;
}

interface SecretsTableState {
    error: null | string;
    showModal: boolean;
    modalType: string;
    secret: Secret;
    canShowSecret: boolean;
    showSecretKey: string;
    showSecretValue: string;
    showSecretLoading: boolean;
}

export default class SecretsTable extends React.Component<SecretsTableProps, SecretsTableState> {
    static CREATE_SECRET_ACTION = 'create';

    static DELETE_SECRET_ACTION = 'delete';

    static UPDATE_SECRET_ACTION = 'update';

    constructor(props: SecretsTableProps) {
        super(props);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            secret: {
                key: '',
                value: ''
            },
            canShowSecret: true,
            showSecretKey: '',
            showSecretValue: '',
            showSecretLoading: false
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('secrets:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: SecretsTableProps, nextState: SecretsTableState) {
        const { data, widget } = this.props;
        return !isEqual(widget, nextProps.widget) || !isEqual(this.state, nextState) || !isEqual(data, nextProps.data);
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('secrets:refresh', this.refreshData);
    }

    onUpdateSecret(secret: Secret) {
        this.setState({
            secret,
            modalType: SecretsTable.UPDATE_SECRET_ACTION,
            showModal: true,
            showSecretKey: '',
            showSecretValue: ''
        });
    }

    onShowSecret(selectedSecret: Secret) {
        const { toolbox } = this.props;
        const secretKey = selectedSecret.key;
        this.setState({
            secret: selectedSecret,
            showSecretKey: secretKey,
            showSecretValue: '',
            showSecretLoading: true
        });

        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
        actions
            .doGet(secretKey)
            .then((secret: Secret) => {
                let canShowSecret = true;
                if (secret.is_hidden_value && isEmpty(secret.value)) {
                    canShowSecret = false;
                }
                this.setState({ showSecretValue: secret.value, showSecretLoading: false, error: null, canShowSecret });
            })
            .catch(err => {
                this.setState({ showSecretLoading: false, error: err.message });
            });
    }

    onHideSecret = () => {
        this.setState({ showSecretKey: '', showSecretValue: '' });
    };

    onDeleteSecret(secret: Secret) {
        this.setState({ secret, modalType: SecretsTable.DELETE_SECRET_ACTION, showModal: true });
    }

    onIsHiddenValueChange(secretKey: string, isHiddenValue: boolean) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
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

    setSecretVisibility(secretKey: string, visibility: Visibility) {
        const { toolbox } = this.props;
        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
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

    fetchGridData = (fetchParams: FetchParams) => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    deleteSecret = () => {
        const { toolbox } = this.props;
        const { secret } = this.state;
        const secretKey = secret.key;
        const actions = new Stage.Common.Secrets.Actions(toolbox.getManager());
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
    };

    hideModal = () => {
        this.setState({ showModal: false });
    };

    refreshData() {
        const { toolbox } = this.props;
        this.setState({ error: null });

        toolbox.refresh();
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
        const NO_DATA_MESSAGE = translateSecrets('noSecrets');
        const { Checkbox, DataTable, ErrorMessage, Icon, ResourceVisibility } = Stage.Basic;
        const DeleteModal = Stage.Basic.Confirm;
        const { TextEllipsis } = Stage.Shared;
        const { data, toolbox, widget } = this.props;
        const { allowedVisibilitySettings } = Stage.Common.Consts;

        return (
            <div>
                <ErrorMessage error={error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData}
                    totalSize={data.total}
                    pageSize={widget.configuration.pageSize}
                    sortColumn={widget.configuration.sortColumn}
                    sortAscending={widget.configuration.sortAscending}
                    searchable
                    className="secretsTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label={translateSecrets('columns.key')} name="key" width="20%" />
                    <DataTable.Column label={translateSecrets('columns.value')} width="20%" />
                    <DataTable.Column
                        label={translateSecrets('columns.hiddenValue')}
                        name="is_hidden_value"
                        width="10%"
                    />
                    <DataTable.Column label={translateSecrets('columns.created')} name="created_at" width="10%" />
                    <DataTable.Column label={translateSecrets('columns.updated')} name="updated_at" width="10%" />
                    <DataTable.Column label={translateSecrets('columns.creator')} name="created_by" width="10%" />
                    <DataTable.Column label={translateSecrets('columns.tenant')} name="tenant_name" width="10%" />
                    <DataTable.Column width="10%" />

                    {data.items.map(item => {
                        return (
                            <DataTable.Row key={item.key}>
                                <DataTable.Data verticalAlign="flexMiddle">
                                    <TextEllipsis maxWidth="400px">{item.key}</TextEllipsis>
                                    <ResourceVisibility
                                        visibility={item.visibility}
                                        onSetVisibility={visibility => {
                                            this.setSecretVisibility(item.key, visibility);
                                        }}
                                        allowedSettingTo={allowedVisibilitySettings}
                                        className="rightFloated"
                                    />
                                </DataTable.Data>
                                <DataTable.Data textAlign="center" className="rowActions">
                                    <SecretValue
                                        canShowSecret={canShowSecret}
                                        secretKey={item.key}
                                        onHide={this.onHideSecret}
                                        onShow={() => this.onShowSecret(item)}
                                        showSecretKey={showSecretKey}
                                        showSecretLoading={showSecretLoading}
                                        showSecretValue={showSecretValue}
                                        toolbox={toolbox}
                                    />
                                </DataTable.Data>
                                <DataTable.Data>
                                    <Checkbox
                                        checked={item.is_hidden_value}
                                        onChange={() => this.onIsHiddenValueChange(item.key, !item.is_hidden_value)}
                                        onClick={e => e.stopPropagation()}
                                    />
                                    {item.is_hidden_value}
                                </DataTable.Data>
                                <DataTable.Data>{item.created_at}</DataTable.Data>
                                <DataTable.Data>{item.updated_at}</DataTable.Data>
                                <DataTable.Data>{item.created_by}</DataTable.Data>
                                <DataTable.Data>{item.tenant_name}</DataTable.Data>
                                <DataTable.Data textAlign="center" className="rowActions">
                                    <Icon
                                        link
                                        name="edit"
                                        title={translateSecrets('actions.updateSecret')}
                                        onClick={() => this.onUpdateSecret(item)}
                                    />
                                    <Icon
                                        link
                                        name="trash"
                                        title={translateSecrets('actions.deleteSecret')}
                                        onClick={() => this.onDeleteSecret(item)}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}

                    <DataTable.Action>
                        <CreateModal toolbox={toolbox} />
                    </DataTable.Action>
                </DataTable>

                {secret && (
                    <>
                        <DeleteModal
                            content={translateSecrets('deleteModal.content', { secretKey: secret.key })}
                            open={modalType === SecretsTable.DELETE_SECRET_ACTION && showModal}
                            onConfirm={this.deleteSecret}
                            onCancel={this.hideModal}
                        />

                        <UpdateModal
                            toolbox={toolbox}
                            open={modalType === SecretsTable.UPDATE_SECRET_ACTION && showModal}
                            onHide={this.hideModal}
                            secret={secret}
                        />
                    </>
                )}
            </div>
        );
    }
}
