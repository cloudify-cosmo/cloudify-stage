// @ts-nocheck File not migrated fully to TS
export default function AddLabelsModal(props) {
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
