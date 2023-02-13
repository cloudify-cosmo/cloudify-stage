import { isEqual } from 'lodash';
import type { Visibility, FetchParams } from 'app/widgets/common/types';
import CreateModal from './CreateModal';
import SiteActions from './SiteActions';
import SiteLocationMap from './SiteLocationMap';
import UpdateModal from './UpdateModal';
import type { Site, SitesWidget } from './widgets.types';

const t = Stage.Utils.getT('widgets.sites');

enum TableActions {
    DELETE_SITE,
    UPDATE_SITE
}

interface SitesTableProps {
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<SitesWidget.Configuration>;
    data: {
        items: Site[];
        total: number;
    };
}

interface SitesTableState {
    error: string | null;
    showModal: boolean;
    modalType?: TableActions;
    site?: Site;
}

export default class SitesTable extends React.Component<SitesTableProps, SitesTableState> {
    constructor(props: SitesTableProps) {
        super(props);

        this.state = {
            error: null,
            showModal: false
        };
    }

    componentDidMount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().on('sites:refresh', this.refreshData, this);
    }

    shouldComponentUpdate(nextProps: SitesTableProps, nextState: SitesTableState) {
        const { data, widget } = this.props;
        return !isEqual(widget, nextProps.widget) || !isEqual(this.state, nextState) || !isEqual(data, nextProps.data);
    }

    componentWillUnmount() {
        const { toolbox } = this.props;
        toolbox.getEventBus().off('sites:refresh', this.refreshData);
    }

    onUpdateSite(site: Site) {
        this.setState({ site, modalType: TableActions.UPDATE_SITE, showModal: true });
    }

    onDeleteSite(site: Site) {
        this.setState({ site, modalType: TableActions.DELETE_SITE, showModal: true });
    }

    setSiteVisibility(siteName: string, visibility: Visibility) {
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

    fetchGridData = (fetchParams: FetchParams) => {
        const { toolbox } = this.props;
        return toolbox.refresh(fetchParams);
    };

    deleteSite = () => {
        const { toolbox } = this.props;
        const { site } = this.state;
        const HIDE_DELETE_MODAL_STATE = { modalType: TableActions.DELETE_SITE, showModal: false };
        const actions = new SiteActions(toolbox);

        actions
            .doDelete(site!.name)
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
        const { allowedVisibilitySettings } = Stage.Common.Consts;
        const { data, toolbox, widget } = this.props;
        let latitude: string | undefined;
        let longitude: string | undefined;

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
                                <DataTable.Data verticalAlign="flexMiddle">
                                    {item.name}
                                    <ResourceVisibility
                                        visibility={item.visibility}
                                        onSetVisibility={visibility => {
                                            this.setSiteVisibility(item.name, visibility);
                                        }}
                                        allowedSettingTo={allowedVisibilitySettings}
                                        className="rightFloated"
                                    />
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
                                                        className="rightFloated"
                                                        onClick={(event: Event) => event.stopPropagation()}
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
                                <DataTable.Data textAlign="center" className="rowActions">
                                    <Icon
                                        link
                                        name="edit"
                                        title={t('actions.updateSite')}
                                        onClick={() => this.onUpdateSite(item)}
                                    />
                                    <Icon
                                        link
                                        name="trash"
                                        title={t('actions.deleteSite')}
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
                    content={`Are you sure you want to delete the site '${site!.name}'?`}
                    open={modalType === TableActions.DELETE_SITE && showModal}
                    onConfirm={this.deleteSite}
                    onCancel={this.hideModal}
                />

                <UpdateModal
                    toolbox={toolbox}
                    open={modalType === TableActions.UPDATE_SITE && showModal}
                    onHide={this.hideModal}
                    site={site}
                />
            </div>
        );
    }
}
