export default function AddLabelsModal(props) {
    const { Modal } = Stage.Common.Labels;
    return (
        <Modal
            hideInitialLabels
            headerKey="widgets.labels.addHeader"
            applyKey="widgets.labels.add"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    );
}
