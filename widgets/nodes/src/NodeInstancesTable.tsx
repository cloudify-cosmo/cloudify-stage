import type { ExtendedNodeInstance } from './types';
import { translateWidget } from './utils';
import InstanceModal from './NodeInstanceModal';

const translate = Stage.Utils.composeT(translateWidget, 'nodeInstancesTable');

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

    const { CopyToClipboardButton, DataTable, Icon } = Stage.Basic;

    return (
        <div>
            <DataTable noDataMessage={translate('noDataMessage')}>
                <DataTable.Column label={translate('columns.instance')} name="id" width="40%" />
                <DataTable.Column label={translate('columns.status')} name="state" width="30%" />
                <DataTable.Column label={translate('columns.details')} name="details" width="30%" />

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
