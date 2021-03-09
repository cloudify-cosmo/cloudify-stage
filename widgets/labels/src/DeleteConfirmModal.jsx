import _ from 'lodash';

export default function DeleteConfirmModal({ deploymentId, labels, labelToDelete, onHide, toolbox }) {
    const { Confirm, Label } = Stage.Basic;
    const { DeploymentActions } = Stage.Common;
    const { i18n } = Stage;

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
                    .then(toolbox.refresh);
                onHide();
            }}
            content={
                <div className="content">
                    {i18n.t('widgets.labels.deleteConfirm')} &nbsp;
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
    labelToDelete: Stage.PropTypes.Label,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

DeleteConfirmModal.defaultProps = { labelToDelete: null };
