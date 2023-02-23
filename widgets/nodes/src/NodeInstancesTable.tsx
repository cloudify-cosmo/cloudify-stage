import type { ExtendedNodeInstance } from './types';
import InstanceModal from './NodeInstanceModal';

interface NodeInstancesTableProps {
    instances: ExtendedNodeInstance[];
    toolbox: Stage.Types.Toolbox;
}

export default function NodeInstancesTable({ instances, toolbox }: NodeInstancesTableProps) {
    const { useResettableState } = Stage.Hooks;
    const [selectedInstance, setInstance, unsetInstance] = useResettableState<ExtendedNodeInstance | undefined>(
        undefined
    );

    const selectNodeInstance = (instance: ExtendedNodeInstance) => {
        const selectedNodeInstanceId = toolbox.getContext().getValue('nodeInstanceId');
        const clickedNodeInstanceId = instance.id;
        toolbox
            .getContext()
            .setValue(
                'nodeInstanceId',
                clickedNodeInstanceId === selectedNodeInstanceId ? null : clickedNodeInstanceId
            );
    };

    const noDataMessage = 'There are no Node Instances of selected Node available.';
    const { CopyToClipboardButton, DataTable, Icon } = Stage.Basic;

    return (
        <div>
            <DataTable className="nodesInstancesTable" noDataMessage={noDataMessage}>
                <DataTable.Column label="Instance" name="id" width="40%" />
                <DataTable.Column label="Status" name="state" width="30%" />
                <DataTable.Column label="Details" name="details" width="30%" />

                {instances.map(instance => {
                    return (
                        <DataTable.Row
                            key={instance.id}
                            selected={instance.isSelected}
                            onClick={() => selectNodeInstance(instance)}
                        >
                            <DataTable.Data>
                                {instance.id}
                                <CopyToClipboardButton text={instance.id} className="rightFloated" />
                            </DataTable.Data>
                            <DataTable.Data>{instance.state}</DataTable.Data>
                            <DataTable.Data textAlign="center" className="rowActions">
                                <Icon
                                    link
                                    className="table"
                                    onClick={(event: Event) => {
                                        event.stopPropagation();
                                        setInstance(instance);
                                    }}
                                />
                            </DataTable.Data>
                        </DataTable.Row>
                    );
                })}
            </DataTable>

            {selectedInstance && <InstanceModal open onClose={unsetInstance} instance={selectedInstance} />}
        </div>
    );
}
