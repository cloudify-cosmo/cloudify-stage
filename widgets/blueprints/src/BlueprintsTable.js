/**
 * Created by kinneretzin on 08/01/2017.
 */

export default class BlueprintsTable extends React.Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        fetchGridData: PropTypes.func,
        onSelectBlueprint: PropTypes.func,
        onDeleteBlueprint: PropTypes.func,
        onCreateDeployment: PropTypes.func,
        onSetVisibility: PropTypes.func,
        allowedSettingTo: PropTypes.array,
        noDataMessage: PropTypes.string
    };

    static defaultProps = {
        fetchGridData: () => {},
        onSelectBlueprint: () => {},
        onDeleteBlueprint: () => {},
        onCreateDeployment: () => {},
        onSetVisibility: () => {},
        allowedSettingTo: ['tenant', 'global'],
        noDataMessage: ''
    };

    render() {
        const { DataTable, Icon, Image, ResourceVisibility } = Stage.Basic;
        const {
            allowedSettingTo,
            data,
            fetchGridData,
            noDataMessage,
            onCreateDeployment,
            onDeleteBlueprint,
            onSelectBlueprint,
            onSetVisibility,
            toolbox,
            widget
        } = this.props;
        const tableName = 'blueprintsTable';

        return (
            <DataTable
                fetchData={fetchGridData}
                totalSize={data.total}
                pageSize={widget.configuration.pageSize}
                sortColumn={widget.configuration.sortColumn}
                sortAscending={widget.configuration.sortAscending}
                selectable
                searchable
                className={tableName}
                noDataMessage={noDataMessage}
            >
                <DataTable.Column label="Name" name="id" width="20%" />
                <DataTable.Column label="Created" name="created_at" width="15%" />
                <DataTable.Column label="Updated" name="updated_at" width="15%" />
                <DataTable.Column label="Creator" name="created_by" width="15%" />
                <DataTable.Column label="Main Blueprint File" name="main_file_name" width="15%" />
                <DataTable.Column label="# Deployments" width="10%" />
                <DataTable.Column width="10%" />

                {data.items.map(item => {
                    const manager = toolbox.getManager();
                    return (
                        <DataTable.Row
                            id={`${tableName}_${item.id}`}
                            key={item.id}
                            selected={item.isSelected}
                            onClick={() => onSelectBlueprint(item)}
                        >
                            <DataTable.Data>
                                <Image
                                    src={Stage.Utils.Url.url(`/ba/image/${item.id}`)}
                                    width="30px"
                                    height="auto"
                                    inline
                                />{' '}
                                <a className="blueprintName" href="#!">
                                    {item.id}
                                </a>
                                <ResourceVisibility
                                    visibility={item.visibility}
                                    onSetVisibility={visibility => onSetVisibility(item.id, visibility)}
                                    allowedSettingTo={allowedSettingTo}
                                    className="rightFloated"
                                />
                            </DataTable.Data>
                            <DataTable.Data>{item.created_at}</DataTable.Data>
                            <DataTable.Data>{item.updated_at}</DataTable.Data>
                            <DataTable.Data>{item.created_by}</DataTable.Data>
                            <DataTable.Data>{item.main_file_name}</DataTable.Data>
                            <DataTable.Data>
                                <div className="ui green horizontal label">{item.depCount}</div>
                            </DataTable.Data>

                            <DataTable.Data className="center aligned rowActions">
                                {!manager.isCommunityEdition() && (
                                    <Icon
                                        name="external share"
                                        bordered
                                        title="Edit a copy in Composer"
                                        onClick={event => {
                                            event.stopPropagation();
                                            window.open(
                                                `/composer/import/${manager.getSelectedTenant()}/${item.id}/${
                                                    item.main_file_name
                                                }`,
                                                '_blank'
                                            );
                                        }}
                                    />
                                )}
                                <i
                                    className="rocket icon link bordered"
                                    title="Create deployment"
                                    onClick={event => {
                                        event.stopPropagation();
                                        onCreateDeployment(item);
                                    }}
                                />
                                <i
                                    className="trash icon link bordered"
                                    title="Delete blueprint"
                                    onClick={event => {
                                        event.stopPropagation();
                                        onDeleteBlueprint(item);
                                    }}
                                />
                            </DataTable.Data>
                        </DataTable.Row>
                    );
                })}
            </DataTable>
        );
    }
}
