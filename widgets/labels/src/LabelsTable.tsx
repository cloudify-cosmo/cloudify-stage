// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import { useState, useEffect } from 'react';
import LabelValueInput from './LabelValueInput';
import DeleteConfirmModal from './DeleteConfirmModal';
import AddLabelsModal from './AddLabelsModal';

export default function LabelsTable({ data, toolbox }) {
    const { Button, DataTable, Icon } = Stage.Basic;
    const { Labels } = Stage.Common;
    const DeploymentActions = Stage.Common.Deployments.Actions;
    const { useBoolean, useRefreshEvent, useInput, useResettableState } = Stage.Hooks;
    const { i18n } = Stage;

    const [isAddModalOpen, openAddModal, closeAddModal] = useBoolean();
    const [labelInEdit, setLabelInEdit, stopLabelEdit] = useResettableState();
    const [currentLabelValue, setCurrentLabelValue] = useInput('');
    const [labelToDelete, setLabelToDelete, unsetLabelToDelete] = useResettableState();
    const [labels, setLabels] = useState(data.labels);

    useRefreshEvent(toolbox, 'labels:refresh');

    const actions = new DeploymentActions(toolbox);

    useEffect(() => setLabels(data.labels), [JSON.stringify(data.labels)]);

    function updateLabelValue() {
        if (currentLabelValue === labelInEdit.value) {
            stopLabelEdit();
            return;
        }

        labelInEdit.value = currentLabelValue;
        setLabels(Labels.sortLabels(labels));
        stopLabelEdit();
        toolbox.loading(true);
        actions.doSetLabels(data.deploymentId, labels).then(() => toolbox.loading(false));
    }

    function exportToJson() {
        Stage.Utils.saveAs(
            new Blob([JSON.stringify(DeploymentActions.toManagerLabels(labels))]),
            `${data.deploymentId}-Labels.json`,
            true
        );
    }

    const hasManagePermission = Stage.Utils.isUserAuthorized('deployment_create', toolbox.getManagerState());

    const tdStyle = { textOverflow: 'ellipsis', overflow: 'hidden' };

    const currentLabelAlreadyUsed = !!_.find(
        labels.filter(label => label !== labelInEdit),
        { ...labelInEdit, value: currentLabelValue }
    );
    const currentLabelIsValid = currentLabelValue !== '' && !currentLabelAlreadyUsed;

    return (
        <>
            <DataTable
                className="labelsTable"
                totalSize={_.size(labels) > 0 ? undefined : 0}
                noDataMessage={i18n.t('widgets.labels.noLabels')}
            >
                <DataTable.Column width="50%" label={i18n.t('widgets.labels.columns.key')} />
                <DataTable.Column width="50%" label={i18n.t('widgets.labels.columns.value')} />
                {hasManagePermission && <DataTable.Column width="80px" />}

                {labels.map(item => (
                    <DataTable.Row key={`${item.key}:${item.value}`}>
                        <DataTable.Data style={tdStyle}>{item.key}</DataTable.Data>
                        <DataTable.Data style={tdStyle}>
                            {_.isEqual(item, labelInEdit) ? (
                                <LabelValueInput
                                    initialValue={item.value}
                                    onCancel={stopLabelEdit}
                                    onChange={setCurrentLabelValue}
                                    onSubmit={updateLabelValue}
                                    valueAlreadyUsed={currentLabelAlreadyUsed}
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
                                    title={i18n.t('widgets.labels.columns.actions.edit')}
                                    onClick={() => {
                                        setLabelInEdit(item);
                                        setCurrentLabelValue(item.value);
                                    }}
                                    disabled={!Labels.isLabelModifiable(item.key)}
                                />
                                <Icon
                                    name="trash"
                                    link
                                    bordered
                                    title={i18n.t('widgets.labels.columns.actions.delete')}
                                    onClick={() => setLabelToDelete(item)}
                                    disabled={!Labels.isLabelModifiable(item.key)}
                                />
                            </DataTable.Data>
                        )}
                        {_.isEqual(item, labelInEdit) && (
                            <DataTable.Data>
                                <Icon
                                    name="check"
                                    color="green"
                                    link={currentLabelIsValid}
                                    bordered
                                    onClick={updateLabelValue}
                                    disabled={!currentLabelIsValid}
                                />
                                <Icon name="cancel" color="red" link bordered onClick={stopLabelEdit} />
                            </DataTable.Data>
                        )}
                    </DataTable.Row>
                ))}

                <DataTable.Action>
                    {hasManagePermission && (
                        <Button
                            content={i18n.t('widgets.labels.add')}
                            icon="add"
                            labelPosition="left"
                            onClick={openAddModal}
                        />
                    )}
                    <Button content="Export" icon="external share" labelPosition="left" onClick={exportToJson} />
                </DataTable.Action>
            </DataTable>

            <AddLabelsModal
                deploymentId={data.deploymentId}
                open={isAddModalOpen}
                onHide={closeAddModal}
                toolbox={toolbox}
            />

            <DeleteConfirmModal
                toolbox={toolbox}
                deploymentId={data.deploymentId}
                onHide={unsetLabelToDelete}
                labels={labels}
                labelToDelete={labelToDelete}
            />
        </>
    );
}

LabelsTable.propTypes = {
    data: PropTypes.shape({
        deploymentId: PropTypes.string.isRequired,
        labels: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
