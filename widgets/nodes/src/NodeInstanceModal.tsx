import { size } from 'lodash';
import type { ExtendedNodeInstance } from './types';

interface NodeInstanceModalProps {
    instance: ExtendedNodeInstance;
    onClose: () => void;
    open: boolean;
}

export default function NodeInstanceModal({ instance, onClose, open }: NodeInstanceModalProps) {
    const noRelationshipsMessage = 'There are no Relationships defined for that Node Instance.';
    const noRuntimePropertiesMessage = 'There are no Runtime Properties defined for that Node Instance.';
    const { CancelButton, CopyToClipboardButton, DataTable, Modal } = Stage.Basic;
    const ParameterValue = Stage.Common.Components.Parameter.Value;
    const ParameterValueDescription = Stage.Common.Components.Parameter.ValueDescription;
    const { Json } = Stage.Utils;

    // Setting totalSize on DataTable components to:
    // 1. Show no-data message when there's no elements
    // 2. Don't show pagination
    const runtimePropertiesTotalSize = size(instance.runtime_properties) > 0 ? undefined : 0;
    const relationshipsTotalSize = size(instance.relationships) > 0 ? undefined : 0;

    return (
        <div>
            <Modal open={open} onClose={() => onClose()} className="nodeInstanceModal">
                <Modal.Header>Node instance {instance.id}</Modal.Header>

                <Modal.Content>
                    <div>
                        <h3>
                            Relationships&nbsp;&nbsp;
                            <CopyToClipboardButton content="Copy" text={Json.stringify(instance.relationships, true)} />
                        </h3>
                        <DataTable
                            className="nodeInstanceRelationshipsTable"
                            totalSize={relationshipsTotalSize}
                            noDataMessage={noRelationshipsMessage}
                        >
                            <DataTable.Column label="Target node" name="target" width="30%" />
                            <DataTable.Column label="Relationship type" name="relationship" width="40%" />
                            <DataTable.Column label="Source node" name="source" width="30%" />

                            {instance.relationships.map(relationship => {
                                return (
                                    <DataTable.Row
                                        key={relationship.target_name + relationship.type + instance.node_id}
                                    >
                                        <DataTable.Data>{relationship.target_name}</DataTable.Data>
                                        <DataTable.Data>{relationship.type}</DataTable.Data>
                                        <DataTable.Data>{instance.node_id}</DataTable.Data>
                                    </DataTable.Row>
                                );
                            })}
                        </DataTable>

                        <h3>
                            Runtime properties&nbsp;&nbsp;
                            <CopyToClipboardButton
                                content="Copy"
                                text={Json.stringify(instance.runtime_properties, true)}
                            />
                        </h3>
                        <DataTable
                            className="nodeInstanceRuntimePropertiesTable"
                            totalSize={runtimePropertiesTotalSize}
                            noDataMessage={noRuntimePropertiesMessage}
                        >
                            <DataTable.Column label="Key" name="key" />
                            <DataTable.Column
                                label={
                                    <span>
                                        Value <ParameterValueDescription />
                                    </span>
                                }
                                name="value"
                            />

                            {Object.keys(instance.runtime_properties).map(key => {
                                const value = instance.runtime_properties[key];
                                return (
                                    <DataTable.Row key={key}>
                                        <DataTable.Data>{key}</DataTable.Data>
                                        <DataTable.Data>
                                            <ParameterValue value={value} />
                                        </DataTable.Data>
                                    </DataTable.Row>
                                );
                            })}
                        </DataTable>
                    </div>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onClose} content="Close" />
                </Modal.Actions>
            </Modal>
        </div>
    );
}
