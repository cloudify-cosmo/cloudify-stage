interface AddLabelsModalProps {
    deploymentId: string;
    open: boolean;
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
}

export default function AddLabelsModal(props: AddLabelsModalProps) {
    const { Modal } = Stage.Common.Labels;
    return (
        <Modal
            hideInitialLabels
            i18nHeaderKey="widgets.labels.addHeader"
            i18nApplyKey="widgets.labels.add"
            {...props}
        />
    );
}
