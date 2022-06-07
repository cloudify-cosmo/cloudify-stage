// @ts-nocheck File not migrated fully to TS
import CreateModal from './CreateModal';
import SiteActions from './SiteActions';
import SiteLocationMap from './SiteLocationMap';
import UpdateModal from './UpdateModal';
import SitePropType from './props/SitePropType';

export default class SitesTable extends React.Component {
    static DELETE_SITE_ACTION = 'delete';

    static UPDATE_SITE_ACTION = 'update';

    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            site: {}
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('sites:refresh', this.refreshData, this);
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
        toolbox.getEventBus().off('sites:refresh', this.refreshData);
    }

    onUpdateSite(site) {
        this.setState({ site, modalType: SitesTable.UPDATE_SITE_ACTION, showModal: true });
    }

    onDeleteSite(site) {
        this.setState({ site, modalType: SitesTable.DELETE_SITE_ACTION, showModal: true });
    }

    setSiteVisibility(siteName, visibility) {
        const { toolbox } = this.props;
        const actions = new SiteActions(toolbox);
        toolbox.loading(true);
        actions
            .doUpdate(siteName, visibility)
            .then(() => {
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                toolbox.loading(false);
                this.setState({ error: err.message });
            });
    }

    fetchGridData = fetchParams => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    deleteSite = () => {
        const { toolbox } = this.props;
        const { site } = this.state;
        const HIDE_DELETE_MODAL_STATE = { modalType: SitesTable.DELETE_SITE_ACTION, showModal: false };
        const actions = new SiteActions(toolbox);

        actions
            .doDelete(site.name)
            .then(() => {
                this.setState({ ...HIDE_DELETE_MODAL_STATE, error: null });
                toolbox.getEventBus().trigger('sites:refresh');
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
        const { error, modalType, showModal, site } = this.state;
        const NO_DATA_MESSAGE = 'There are no Sites available. Click "Create" to create Sites.';
        const { DataTable, ErrorMessage, Icon, ResourceVisibility, Label, Popup } = Stage.Basic;
        const DeleteModal = Stage.Basic.Confirm;
        const { VerticallyAlignedCell } = Stage.Shared;
        const { allowedVisibilitySettings } = Stage.Common.Consts;
        const { data, toolbox, widget } = this.props;
        let latitude;
        let longitude = null;

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

                    {data.items.map(item => {
                        if (item.location) {
                            [latitude, longitude] = item.location.split(',');
                        }

                        return (
                            <DataTable.Row key={item.name}>
                                <DataTable.Data>
                                    <VerticallyAlignedCell>
                                        {item.name}
                                        <ResourceVisibility
                                            visibility={item.visibility}
                                            onSetVisibility={visibility => {
                                                this.setSiteVisibility(item.name, visibility);
                                            }}
                                            allowedSettingTo={allowedVisibilitySettings}
                                            className="rightFloated"
                                        />
                                    </VerticallyAlignedCell>
                                </DataTable.Data>
                                <DataTable.Data>
                                    {item.location && (
                                        <>
                                            Latitude: {latitude}, Longitude: {longitude}
                                            <Popup hoverable>
                                                <Popup.Trigger>
                                                    <Icon
                                                        name="crosshairs"
                                                        link
                                                        bordered
                                                        className="rightFloated"
                                                        onClick={event => event.stopPropagation()}
                                                    />
                                                </Popup.Trigger>
                                                <Popup.Content>
                                                    <SiteLocationMap
                                                        location={item.location}
                                                        mapOptions={{
                                                            zoomControl: false,
                                                            style: { width: 200, height: 200 }
                                                        }}
                                                        toolbox={toolbox}
                                                    />
                                                </Popup.Content>
                                            </Popup>
                                        </>
                                    )}
                                </DataTable.Data>
                                <DataTable.Data>{item.created_at}</DataTable.Data>
                                <DataTable.Data>{item.created_by}</DataTable.Data>
                                <DataTable.Data>{item.tenant_name}</DataTable.Data>
                                <DataTable.Data>
                                    <Label className="blue" horizontal>
                                        {item.deploymentCount}
                                    </Label>
                                </DataTable.Data>
                                <DataTable.Data className="center aligned rowActions">
                                    <Icon
                                        bordered
                                        link
                                        name="edit"
                                        title="Update site"
                                        onClick={() => this.onUpdateSite(item)}
                                    />
                                    <Icon
                                        bordered
                                        link
                                        name="trash"
                                        title="Delete site"
                                        onClick={() => this.onDeleteSite(item)}
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
                    content={`Are you sure you want to delete the site '${site.name}'?`}
                    open={modalType === SitesTable.DELETE_SITE_ACTION && showModal}
                    onConfirm={this.deleteSite}
                    onCancel={this.hideModal}
                />

                <UpdateModal
                    toolbox={toolbox}
                    open={modalType === SitesTable.UPDATE_SITE_ACTION && showModal}
                    onHide={this.hideModal}
                    site={site}
                />
            </div>
        );
    }
}

SitesTable.propTypes = {
    data: PropTypes.shape({
        items: PropTypes.arrayOf(SitePropType),
        total: PropTypes.number
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
