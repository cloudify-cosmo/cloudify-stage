import type { DataTableProps } from 'cloudify-ui-components';
import { useEffect } from 'react';
import TypeHierarchyTree from './TypeHierarchyTree';
import NodeTypeIcon from './NodeType';
import type { ExtendedNode, NodesConfiguration } from './types';
import NodeInstancesTable from './NodeInstancesTable';

interface NodesTableProps {
    data: {
        blueprintSelected: boolean;
        deploymentSelected: boolean;
        items: ExtendedNode[];
        total: number;
    };
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<NodesConfiguration>;
}

export default function NodesTable({ data, toolbox, widget }: NodesTableProps) {
    const refreshData = () => toolbox.refresh();
    const fetchGridData: DataTableProps['fetchData'] = fetchParams => toolbox.refresh(fetchParams);
    useEffect(() => {
        toolbox.getEventBus().on('nodes:refresh', refreshData);
        return () => toolbox.getEventBus().off('nodes:refresh', refreshData);
    }, []);

    const selectNode = (node: ExtendedNode) => {
        const selectedDepNodeId = toolbox.getContext().getValue('depNodeId');
        const clickedDepNodeId = node.id + node.deployment_id;
        const clickedAlreadySelectedNode = clickedDepNodeId === selectedDepNodeId;
        toolbox.getContext().setValue('depNodeId', clickedAlreadySelectedNode ? null : clickedDepNodeId);
        toolbox.getContext().setValue('nodeId', clickedAlreadySelectedNode ? null : node.id);
        toolbox.getContext().setValue('nodeInstanceId', null);
        toolbox.getEventBus().trigger('topology:selectNode', clickedAlreadySelectedNode ? null : node.id);
    };

    const noDataMessage = "There are no Nodes available. Probably there's no deployment created, yet.";
    const { CopyToClipboardButton, DataTable, Icon, Label, Popup } = Stage.Basic;

    const { fieldsToShow } = widget.configuration;

    return (
        <DataTable
            fetchData={fetchGridData}
            totalSize={data.total}
            pageSize={widget.configuration.pageSize}
            sortColumn={widget.configuration.sortColumn}
            sortAscending={widget.configuration.sortAscending}
            searchable
            selectable
            className="nodesTable"
            noDataMessage={noDataMessage}
        >
            <DataTable.Column width="5%" />
            <DataTable.Column label="Name" name="id" width="15%" show={fieldsToShow.indexOf('Name') >= 0} />
            <DataTable.Column label="Type" name="type" width="20%" show={fieldsToShow.indexOf('Type') >= 0} />
            <DataTable.Column
                label="Blueprint"
                name="blueprint_id"
                width="10%"
                show={fieldsToShow.indexOf('Blueprint') >= 0 && !data.blueprintSelected}
            />
            <DataTable.Column
                label="Deployment"
                name="deployment_display_name"
                width="10%"
                show={fieldsToShow.indexOf('Deployment') >= 0 && !data.deploymentSelected}
            />
            <DataTable.Column
                label="Deployment ID"
                name="deployment_id"
                width="10%"
                show={fieldsToShow.indexOf('Deployment ID') >= 0 && !data.deploymentSelected}
            />
            <DataTable.Column
                label="Contained in"
                name="host_id"
                width="7%"
                show={fieldsToShow.indexOf('Contained in') >= 0}
            />
            <DataTable.Column label="Connected to" width="7%" show={fieldsToShow.indexOf('Connected to') >= 0} />
            <DataTable.Column label="Host" name="host_id" width="7%" show={fieldsToShow.indexOf('Host') >= 0} />
            <DataTable.Column
                label="Creator"
                name="created_by"
                width="7%"
                show={fieldsToShow.indexOf('Creator') >= 0}
            />
            <DataTable.Column
                label="# Instances"
                name="actual_number_of_instances"
                width="9%"
                show={fieldsToShow.indexOf('# Instances') >= 0}
            />
            <DataTable.Column
                label="Groups"
                width="10%"
                show={fieldsToShow.indexOf('Groups') >= 0 && (data.blueprintSelected || data.deploymentSelected)}
            />

            {data.items.map(node => {
                return (
                    <DataTable.RowExpandable key={node.id + node.deployment_id} expanded={node.isSelected}>
                        <DataTable.Row
                            key={node.id + node.deployment_id}
                            selected={node.isSelected}
                            onClick={() => selectNode(node)}
                        >
                            <DataTable.Data textAlign="center">
                                <NodeTypeIcon typeHierarchy={node.type_hierarchy} />
                            </DataTable.Data>
                            <DataTable.Data>
                                <a className="nodeName" href="#!">
                                    {node.id}
                                </a>
                            </DataTable.Data>
                            <DataTable.Data>
                                <div>
                                    {node.type}
                                    <Popup hoverable>
                                        <Popup.Trigger>
                                            <Icon
                                                name="sitemap"
                                                link
                                                className="rightFloated"
                                                onClick={(event: Event) => event.stopPropagation()}
                                            />
                                        </Popup.Trigger>
                                        <Popup.Header>
                                            Type Hierarchy
                                            <CopyToClipboardButton
                                                text={String(node.type_hierarchy)}
                                                className="rightFloated"
                                            />
                                        </Popup.Header>
                                        <Popup.Content>
                                            <TypeHierarchyTree typeHierarchy={node.type_hierarchy} />
                                        </Popup.Content>
                                    </Popup>
                                </div>
                            </DataTable.Data>
                            <DataTable.Data>{node.blueprint_id}</DataTable.Data>
                            <DataTable.Data>{node.deployment_display_name}</DataTable.Data>
                            <DataTable.Data>{node.deployment_id}</DataTable.Data>
                            <DataTable.Data>{node.containedIn}</DataTable.Data>
                            <DataTable.Data>{node.connectedTo}</DataTable.Data>
                            <DataTable.Data>{node.host_id}</DataTable.Data>
                            <DataTable.Data>{node.created_by}</DataTable.Data>
                            <DataTable.Data>
                                <Label color="green" horizontal>
                                    {node.numberOfInstances}
                                </Label>
                            </DataTable.Data>
                            <DataTable.Data>{node.groups}</DataTable.Data>
                        </DataTable.Row>

                        <DataTable.DataExpandable key={`${node.id + node.deployment_id}_Expanded`}>
                            <NodeInstancesTable instances={node.instances} toolbox={toolbox} />
                        </DataTable.DataExpandable>
                    </DataTable.RowExpandable>
                );
            })}
        </DataTable>
    );
}
