export default function TerraformDetailsModal({ terraformDetails, onClose }) {
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

                    {_(terraformDetails)
                        .sortBy('type')
                        .map(tfResource => (
                            <DataTable.Row key={tfResource.name}>
                                <DataTable.Data>{tfResource.type}</DataTable.Data>
                                <DataTable.Data>{tfResource.name}</DataTable.Data>
                                <DataTable.Data>{tfResource.provider}</DataTable.Data>
                                <DataTable.Data>
                                    <HighlightText>{JSON.stringify(tfResource, null, 2)}</HighlightText>
                                </DataTable.Data>
                            </DataTable.Row>
                        ))
                        .value()}
                </DataTable>
            </Modal.Content>
            <Modal.Actions>
                <CancelButton onClick={onClose} content="Close" />
            </Modal.Actions>
        </Modal>
    );
}

TerraformDetailsModal.propTypes = {
    terraformDetails: PropTypes.shape({}),
    onClose: PropTypes.func.isRequired
};

TerraformDetailsModal.defaultProps = {
    terraformDetails: null
};
