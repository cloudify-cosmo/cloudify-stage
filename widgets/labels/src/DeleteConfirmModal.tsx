// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';

export default function DeleteConfirmModal({ deploymentId, labels, labelToDelete, onHide, toolbox }) {
    const { Confirm, Label } = Stage.Basic;
    const DeploymentActions = Stage.Common.Deployments.Actions;
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
                    <Label size="large" style={{ wordBreak: 'break-all' }}>
                        {labelToDelete?.key} <span style={{ fontWeight: 'lighter' }}>{labelToDelete?.value}</span>
                    </Label>
                    ?
                </div>
            }
        />
    );
}

const LabelPropType = PropTypes.shape({ key: PropTypes.string, value: PropTypes.string, isInSystem: PropTypes.bool });
const LabelsPropType = PropTypes.arrayOf(LabelPropType);

DeleteConfirmModal.propTypes = {
    deploymentId: PropTypes.string.isRequired,
    labels: LabelsPropType.isRequired,
    labelToDelete: LabelPropType,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

DeleteConfirmModal.defaultProps = { labelToDelete: null };
