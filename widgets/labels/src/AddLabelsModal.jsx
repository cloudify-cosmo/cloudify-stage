export default function AddLabelsModal(props) {
    const { Modal } = Stage.Common.Labels;
    return (
        <Modal
            hideInitialLabels
            i18nHeaderKey="widgets.labels.addHeader"
            i18nApplyKey="widgets.labels.add"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    );
}
