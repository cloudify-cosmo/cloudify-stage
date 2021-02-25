import _ from 'lodash';

export default function DeleteConfirmModal({ deploymentId, labels, labelToDelete, onHide, toolbox }) {
    const { Confirm, Label } = Stage.Basic;
    const { DeploymentActions } = Stage.Common;

    return (
        <Confirm
            open={!!labelToDelete}
            onCancel={onHide}
            onConfirm={() => {
                new DeploymentActions(toolbox)
                    .doSetLabels(
                        deploymentId,
                        labels.filter(filteredItem => !_.isEqual(filteredItem, labelToDelete))
                    )
                    .then(() => toolbox.refresh());
                onHide();
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
    );
}

DeleteConfirmModal.propTypes = {
    deploymentId: PropTypes.string.isRequired,
    labels: Stage.PropTypes.Labels.isRequired,
    labelToDelete: Stage.PropTypes.Label.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
