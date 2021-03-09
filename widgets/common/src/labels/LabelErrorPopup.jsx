export default function LabelsErrorPopup({ open, content }) {
    const {
        Basic: { Popup }
    } = Stage;

    return <Popup open={open} trigger={<div />} content={content} position="top left" pinned wide />;
}

LabelsErrorPopup.propTypes = {
    open: PropTypes.bool.isRequired,
    content: PropTypes.node.isRequired
};
