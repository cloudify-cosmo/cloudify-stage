export default function LabelsErrorPopup({ content }) {
    const {
        Basic: { Popup }
    } = Stage;

    return <Popup open trigger={<div />} content={content} position="top left" pinned wide />;
}

LabelsErrorPopup.propTypes = {
    content: PropTypes.node.isRequired
};
