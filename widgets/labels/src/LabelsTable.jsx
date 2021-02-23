export default function LabelsTable({ data, toolbox }) {
    const { Button, Confirm, DataTable, Form, Icon, Label } = Stage.Basic;
    const { DeploymentActions, ManageLabelsModal, RevertToDefaultIcon } = Stage.Common;
    const { useBoolean, useInput, useResettableState } = Stage.Hooks;

    const [isAddModalOpen, openAddModal, closeAddModal] = useBoolean();
    const [labelInEdit, setLabelInEdit, stopLabelEdit] = useResettableState();
    const [currentLabelValue, setCurrentLabelValue] = useInput('');
    const [labelToDelete, setLabelToDelete, unsetLabelToDelete] = useResettableState();

    const actions = new DeploymentActions(toolbox);

    function updateLabelValue() {
        if (!currentLabelValue) return;

        if (_.find(data.items, { value: currentLabelValue })) {
            if (currentLabelValue === labelInEdit.value) stopLabelEdit();
            return;
        }

        labelInEdit.value = currentLabelValue;
        stopLabelEdit();
        actions.doSetLabels(data.deploymentId, data.items);
    }

    const hasManagePermission = Stage.Utils.isUserAuthorized('deployment_create', toolbox.getManagerState());

    return (
        <>
            <DataTable
                className="labelsTable"
                totalSize={_.size(data.items) > 0 ? undefined : 0}
                noDataMessage="There are no Labels defined"
            >
                <DataTable.Column width="50%" label="Key" />
                <DataTable.Column width="50%" label="Value" />
                {hasManagePermission && <DataTable.Column width="80px" />}

                {_.map(data.items, item => (
                    <DataTable.Row key={`${item.key}:${item.value}`}>
                        <DataTable.Data>{item.key}</DataTable.Data>
                        <DataTable.Data>
                            {item === labelInEdit ? (
                                <Form.Input
                                    className="labelValueEditInput"
                                    autoFocus
                                    fluid
                                    style={{ padding: 0 }}
                                    value={currentLabelValue}
                                    onBlur={updateLabelValue}
                                    onKeyDown={e => {
                                        if (e.key === 'Escape') stopLabelEdit();
                                        else if (e.key === 'Enter') updateLabelValue();
                                    }}
                                    onChange={setCurrentLabelValue}
                                    icon={
                                        <RevertToDefaultIcon
                                            value={currentLabelValue}
                                            defaultValue={item.value}
                                            popupContent="Revert to initial value"
                                            onMouseDown={e => {
                                                e.preventDefault();
                                                setCurrentLabelValue(item.value);
                                            }}
                                        />
                                    }
                                />
                            ) : (
                                item.value
                            )}
                        </DataTable.Data>
                        {hasManagePermission && (
                            <DataTable.Data>
                                <Icon
                                    name="edit"
                                    link
                                    bordered
                                    title="Edit label"
                                    onClick={() => {
                                        setLabelInEdit(item);
                                        setCurrentLabelValue(item.value);
                                    }}
                                />
                                <Icon
                                    name="trash"
                                    link
                                    bordered
                                    title="Delete label"
                                    onClick={() => setLabelToDelete(item)}
                                />
                            </DataTable.Data>
                        )}
                    </DataTable.Row>
                ))}

                {data.deploymentId && (
                    <DataTable.Action>
                        {hasManagePermission && (
                            <Button content="Add" icon="add" labelPosition="left" onClick={openAddModal} />
                        )}
                        <Button
                            content="Export"
                            icon="external share"
                            labelPosition="left"
                            onClick={() =>
                                Stage.Utils.saveAs(
                                    new Blob([JSON.stringify(data.items.map(item => _.pick(item, 'key', 'value')))]),
                                    `${data.deploymentId}-Labels.json`,
                                    true
                                )
                            }
                        />
                    </DataTable.Action>
                )}
            </DataTable>

            <ManageLabelsModal
                deploymentId={data.deploymentId}
                existingLabels={data.items}
                header={`Add labels for deployment '${data.deploymentId}'`}
                open={isAddModalOpen}
                onHide={() => {
                    closeAddModal();
                    toolbox.refresh();
                }}
                toolbox={toolbox}
            />

            <Confirm
                open={!!labelToDelete}
                onCancel={unsetLabelToDelete}
                onConfirm={() => {
                    data.items = data.items.filter(filteredItem => filteredItem !== labelToDelete);
                    actions.doSetLabels(data.deploymentId, data.items);
                    unsetLabelToDelete();
                }}
                content={
                    <div className="content">
                        Are you sure you want to remove label &nbsp;
                        <Label size="large">
                            {labelToDelete?.key} <span style={{ fontWeight: 'lighter' }}>{labelToDelete?.value}</span>
                        </Label>
                        ?
                    </div>
                }
            />
        </>
    );
}

LabelsTable.propTypes = {
    data: PropTypes.shape({
        deploymentId: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
