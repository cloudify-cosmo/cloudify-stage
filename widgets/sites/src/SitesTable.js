import CreateModal from './CreateModal';
import UpdateModal from './UpdateModal';
import SiteActions from './SiteActions';

export default class SitesTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            site: {}
        };
    }

    /**
     * propTypes
     *
     * @property {object} widget Widget object
     * @property {object} data sites data including the items and the total number
     * @property {object} toolbox Toolbox object
     */
    static propTypes = {
        widget: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    static DELETE_SITE_ACTION = 'delete';

    static UPDATE_SITE_ACTION = 'update';

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.state, nextState) ||
            !_.isEqual(this.props.data, nextProps.data)
        );
    }

    _refreshData() {
        this.setState({ error: null });
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('sites:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('sites:refresh', this._refreshData);
    }

    fetchGridData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    _onDeleteSite(site) {
        this.setState({ site, modalType: SitesTable.DELETE_SITE_ACTION, showModal: true });
    }

    _onUpdateSite(site) {
        this.setState({ site, modalType: SitesTable.UPDATE_SITE_ACTION, showModal: true });
    }

    _setSiteVisibility(site_name, visibility) {
        const actions = new SiteActions(this.props.toolbox);
        this.props.toolbox.loading(true);
        actions
            .doUpdate(site_name, visibility)
            .then(() => {
                this.props.toolbox.loading(false);
                this.props.toolbox.refresh();
            })
            .catch(err => {
                this.props.toolbox.loading(false);
                this.setState({ error: err.message });
            });
    }

    _deleteSite() {
        const HIDE_DELETE_MODAL_STATE = { modalType: SitesTable.DELETE_SITE_ACTION, showModal: false };
        const actions = new SiteActions(this.props.toolbox);

        actions
            .doDelete(this.state.site.name)
            .then(() => {
                this.setState({ ...HIDE_DELETE_MODAL_STATE, error: null });
                this.props.toolbox.getEventBus().trigger('sites:refresh');
            })
            .catch(err => {
                this.setState({ ...HIDE_DELETE_MODAL_STATE, error: err.message });
            });
    }

    _hideModal() {
        this.setState({ showModal: false });
    }

    render() {
        const NO_DATA_MESSAGE = 'There are no Sites available. Click "Create" to create Sites.';
        const { DataTable, ErrorMessage, Icon, ResourceVisibility, Label } = Stage.Basic;
        const DeleteModal = Stage.Basic.Confirm;
        const { data } = this.props;
        let latitude;
        let longitude = null;

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({ error: null })} autoHide />

                <DataTable
                    fetchData={this.fetchGridData.bind(this)}
                    totalSize={data.total}
                    pageSize={this.props.widget.configuration.pageSize}
                    sortColumn={this.props.widget.configuration.sortColumn}
                    sortAscending={this.props.widget.configuration.sortAscending}
                    searchable
                    className="sitesTable"
                    noDataMessage={NO_DATA_MESSAGE}
                >
                    <DataTable.Column label="Name" name="name" width="20%" />
                    <DataTable.Column label="Location" width="20%" />
                    <DataTable.Column label="Created" name="created_at" width="20%" />
                    <DataTable.Column label="Creator" name="created_by" width="10%" />
                    <DataTable.Column label="Tenant" name="tenant_name" width="10%" />
                    <DataTable.Column label="# Deployments" width="10%" />
                    <DataTable.Column width="10%" />

                    {data.items.map(site => {
                        if (site.location) {
                            [latitude, longitude] = site.location.split(',');
                        }

                        return (
                            <DataTable.Row key={site.name}>
                                <DataTable.Data>
                                    {site.name}
                                    <ResourceVisibility
                                        visibility={site.visibility}
                                        onSetVisibility={visibility => {
                                            this._setSiteVisibility(site.name, visibility);
                                        }}
                                        allowedSettingTo={['tenant', 'global']}
                                        className="rightFloated"
                                    />
                                </DataTable.Data>
                                <DataTable.Data>
                                    {site.location && `Latitude: ${latitude}, Longitude: ${longitude}`}
                                </DataTable.Data>
                                <DataTable.Data>{site.created_at}</DataTable.Data>
                                <DataTable.Data>{site.created_by}</DataTable.Data>
                                <DataTable.Data>{site.tenant_name}</DataTable.Data>
                                <DataTable.Data>
                                    <Label className="blue" horizontal>
                                        {site.deploymentCount}
                                    </Label>
                                </DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <Icon
                                        bordered
                                        link
                                        name="edit"
                                        title="Update site"
                                        onClick={this._onUpdateSite.bind(this, site)}
                                    />
                                    <Icon
                                        bordered
                                        link
                                        name="trash"
                                        title="Delete site"
                                        onClick={this._onDeleteSite.bind(this, site)}
                                    />
                                </DataTable.Data>
                            </DataTable.Row>
                        );
                    })}

                    <DataTable.Action>
                        <CreateModal toolbox={this.props.toolbox} />
                    </DataTable.Action>
                </DataTable>

                <DeleteModal
                    content={`Are you sure you want to delete the site '${this.state.site.name}'?`}
                    open={this.state.modalType === SitesTable.DELETE_SITE_ACTION && this.state.showModal}
                    onConfirm={this._deleteSite.bind(this)}
                    onCancel={this._hideModal.bind(this)}
                />

                <UpdateModal
                    toolbox={this.props.toolbox}
                    open={this.state.modalType === SitesTable.UPDATE_SITE_ACTION && this.state.showModal}
                    onHide={this._hideModal.bind(this)}
                    site={this.state.site}
                />
            </div>
        );
    }
}
