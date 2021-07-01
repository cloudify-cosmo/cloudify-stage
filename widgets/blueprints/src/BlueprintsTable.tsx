import BlueprintState from './BlueprintState';
import type { BlueprintsViewProps } from './types';

export default function BlueprintsTable({
    data,
    fetchData,
    noDataMessage,
    onCreateDeployment,
    onDeleteBlueprint,
    onSelectBlueprint,
    onSetVisibility,
    toolbox,
    widget
}: BlueprintsViewProps) {
    const { DataTable, Icon, Image, ResourceVisibility } = Stage.Basic;
    const { BlueprintActions } = Stage.Common;
    const tableName = 'blueprintsTable';

    return (
        <DataTable
            fetchData={fetchData}
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
            <DataTable.Column label="State" name="state" />
            <DataTable.Column label="# Deployments" />
            <DataTable.Column width="10%" />

            {data.items.map(item => (
                <DataTable.Row
                    id={`${tableName}_${item.id}`}
                    key={item.id}
                    selected={item.isSelected}
                    onClick={BlueprintActions.isUploaded(item) ? () => onSelectBlueprint(item) : null}
                >
                    <DataTable.Data>
                        <Image src={Stage.Utils.Url.url(`/ba/image/${item.id}`)} width="30px" height="auto" inline />{' '}
                        <a className="blueprintName" href="#!">
                            {item.id}
                        </a>
                        <ResourceVisibility
                            visibility={item.visibility}
                            onSetVisibility={visibility => onSetVisibility(item.id, visibility)}
                            allowedSettingTo={['tenant', 'global']}
                            className="rightFloated"
                        />
                    </DataTable.Data>
                    <DataTable.Data>{item.created_at}</DataTable.Data>
                    <DataTable.Data>{item.updated_at}</DataTable.Data>
                    <DataTable.Data>{item.created_by}</DataTable.Data>
                    <DataTable.Data>{item.main_file_name}</DataTable.Data>
                    <DataTable.Data>
                        <BlueprintState blueprint={item} />
                    </DataTable.Data>
                    <DataTable.Data style={{ textAlign: 'center' }}>
                        <div className="ui green horizontal label">{item.depCount}</div>
                    </DataTable.Data>

                    <DataTable.Data className="center aligned rowActions">
                        {BlueprintActions.isCompleted(item) && (
                            <>
                                {BlueprintActions.isUploaded(item) && (
                                    <>
                                        {!toolbox.getManager().isCommunityEdition() &&
                                            widget.configuration.showEditCopyInComposerButton && (
                                                <Icon
                                                    name="external share"
                                                    bordered
                                                    title="Edit a copy in Composer"
                                                    onClick={(event: Event) => {
                                                        event.stopPropagation();
                                                        new Stage.Common.BlueprintActions(toolbox).doEditInComposer(
                                                            item.id,
                                                            item.main_file_name
                                                        );
                                                    }}
                                                />
                                            )}
                                        <Icon
                                            name="rocket"
                                            link
                                            bordered
                                            title="Create deployment"
                                            onClick={(event: Event) => {
                                                event.stopPropagation();
                                                onCreateDeployment(item);
                                            }}
                                        />
                                    </>
                                )}
                                <Icon
                                    name="trash"
                                    link
                                    bordered
                                    title="Delete blueprint"
                                    onClick={(event: Event) => {
                                        event.stopPropagation();
                                        onDeleteBlueprint(item);
                                    }}
                                />
                            </>
                        )}
                    </DataTable.Data>
                </DataTable.Row>
            ))}
        </DataTable>
    );
}
