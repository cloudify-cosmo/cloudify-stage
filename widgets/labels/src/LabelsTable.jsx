import _ from 'lodash';
import { useState, useEffect } from 'react';
import LabelValueInput from './LabelValueInput';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function LabelsTable({ data, toolbox }) {
    const { Button, DataTable, Icon } = Stage.Basic;
    const { DeploymentActions, ManageLabelsModal } = Stage.Common;
    const { useBoolean, useInput, useResettableState } = Stage.Hooks;

    const [isAddModalOpen, openAddModal, closeAddModal] = useBoolean();
    const [labelInEdit, setLabelInEdit, stopLabelEdit] = useResettableState();
    const [currentLabelValue, setCurrentLabelValue] = useInput('');
    const [labelToDelete, setLabelToDelete, unsetLabelToDelete] = useResettableState();
    const [labels, setLabels] = useState(data.items);

    const actions = new DeploymentActions(toolbox);

    useEffect(() => setLabels(data.items), [JSON.stringify(data.items)]);

    function updateLabelValue() {
        if (!currentLabelValue) return;

        if (currentLabelValue === labelInEdit.value) {
            stopLabelEdit();
            return;
        }

        if (_.find(labels, { ...labelInEdit, value: currentLabelValue })) return;

        labelInEdit.value = currentLabelValue;
        setLabels([...labels]);
        stopLabelEdit();
        toolbox.loading(true);
        actions.doSetLabels(data.deploymentId, labels).then(() => toolbox.loading(false));
    }

    function exportToJson() {
        Stage.Utils.saveAs(
            new Blob([JSON.stringify(labels.map(({ key, value }) => ({ [key]: value })))]),
            `${data.deploymentId}-Labels.json`,
            true
        );
    }

    const hasManagePermission = Stage.Utils.isUserAuthorized('deployment_create', toolbox.getManagerState());

    return (
        <>
            <DataTable
                className="labelsTable"
                totalSize={_.size(labels) > 0 ? undefined : 0}
                noDataMessage="There are no Labels defined"
            >
                <DataTable.Column width="50%" label="Key" />
                <DataTable.Column width="50%" label="Value" />
                {hasManagePermission && <DataTable.Column width="80px" />}

                {labels.map(item => (
                    <DataTable.Row key={`${item.key}:${item.value}`} onClick={null}>
                        <DataTable.Data>{item.key}</DataTable.Data>
                        <DataTable.Data>
                            {_.isEqual(item, labelInEdit) ? (
                                <LabelValueInput
                                    initialValue={item.value}
                                    onCancel={stopLabelEdit}
                                    onChange={setCurrentLabelValue}
                                    onSubmit={updateLabelValue}
                                />
                            ) : (
                                item.value
                            )}
                        </DataTable.Data>
                        {hasManagePermission && !_.isEqual(item, labelInEdit) && (
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
                        {_.isEqual(item, labelInEdit) && (
                            <DataTable.Data>
                                <Icon name="check" color="green" link bordered onClick={updateLabelValue} />
                                <Icon name="cancel" color="red" link bordered onClick={stopLabelEdit} />
                            </DataTable.Data>
                        )}
                    </DataTable.Row>
                ))}

                <DataTable.Action>
                    {hasManagePermission && (
                        <Button content="Add" icon="add" labelPosition="left" onClick={openAddModal} />
                    )}
                    <Button content="Export" icon="external share" labelPosition="left" onClick={exportToJson} />
                </DataTable.Action>
            </DataTable>

            <ManageLabelsModal
                deploymentId={data.deploymentId}
                existingLabels={labels}
                header={`Add labels for deployment '${data.deploymentId}'`}
                applyButtonContent="Add"
                open={isAddModalOpen}
                onHide={() => {
                    closeAddModal();
                    toolbox.refresh();
                }}
                toolbox={toolbox}
            />

            <DeleteConfirmModal
                toolbox={toolbox}
                deploymentId={data.deploymentId}
                onHide={unsetLabelToDelete}
                labels={data.items}
                labelToDelete={labelToDelete}
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
