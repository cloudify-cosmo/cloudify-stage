import _ from 'lodash';
import type { Label as LabelType } from '../../../app/widgets/common/labels/types';

interface DeleteConfirmModalProps {
    deploymentId: string;
    labels: LabelType[];
    labelToDelete?: LabelType | null;
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
}

export default function DeleteConfirmModal({
    deploymentId,
    labels,
    labelToDelete = null,
    onHide,
    toolbox
}: DeleteConfirmModalProps) {
    const { Confirm, Label } = Stage.Basic;
    const DeploymentActions = Stage.Common.Deployments.Actions;
    const { i18n } = Stage;

    return (
        <Confirm
            open={!!labelToDelete}
            onCancel={onHide}
            onConfirm={() => {
                new DeploymentActions(toolbox.getManager())
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
