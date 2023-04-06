import { sortBy } from 'lodash';
import type { TerraformResources } from 'widgets/topology/src/widget.types';

export interface TerraformDetailsModalProps {
    terraformDetails?: TerraformResources;
    onClose: () => void;
}

export default function TerraformDetailsModal({ terraformDetails, onClose }: TerraformDetailsModalProps) {
    const { Modal, DataTable, HighlightText, CancelButton } = Stage.Basic;

    return (
        <Modal open={!!terraformDetails} onClose={onClose}>
            <Modal.Header>Terraform resources</Modal.Header>
            <Modal.Content>
                <DataTable>
                    <DataTable.Column label="Object (type)" />
                    <DataTable.Column label="Name" />
                    <DataTable.Column label="Provider" />
                    <DataTable.Column label="Raw data" />

                    {sortBy(terraformDetails, 'type').map(tfResource => (
                        <DataTable.Row key={tfResource.name}>
                            <DataTable.Data>{tfResource.type}</DataTable.Data>
                            <DataTable.Data>{tfResource.name}</DataTable.Data>
                            <DataTable.Data>{tfResource.provider}</DataTable.Data>
                            <DataTable.Data>
                                <HighlightText>{JSON.stringify(tfResource, null, 2)}</HighlightText>
                            </DataTable.Data>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </Modal.Content>
            <Modal.Actions>
                <CancelButton onClick={onClose} content="Close" />
            </Modal.Actions>
        </Modal>
    );
}
