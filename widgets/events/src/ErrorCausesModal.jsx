/**
 * Created by jakub.niezgoda on 29/10/2018.
 */

export default function ErrorCausesModal({ errorCauses, onClose, open }) {
    const { Json } = Stage.Utils;
    const {
        CancelButton,
        CopyToClipboardButton,
        Divider,
        Header,
        HighlightText,
        Message,
        Modal,
        Segment
    } = Stage.Basic;
    const numberOfErrorCauses = _.size(errorCauses);

    return numberOfErrorCauses > 0 ? (
        <Modal open={open} onClose={onClose}>
            <Modal.Header>Error Causes</Modal.Header>
            <Modal.Content scrolling>
                {_.map(errorCauses, ({ message, traceback, type }, index) => (
                    <Segment key={`errorCause_${index}`} basic>
                        {numberOfErrorCauses > 1 && (
                            <>
                                <Header size="medium">Error Cause #{index + 1}</Header>
                                <Divider />
                            </>
                        )}
                        <Header size="small">Type</Header>
                        <Message info>{type}</Message>
                        <Header size="small">Message</Header>
                        <Message error>{message}</Message>
                        <Header size="small">Traceback</Header>
                        <HighlightText language="python">{traceback}</HighlightText>
                    </Segment>
                ))}
            </Modal.Content>
            <Modal.Actions>
                <CopyToClipboardButton content="Copy Error Causes" text={Json.stringify(errorCauses, true)} />
                <CancelButton
                    onClick={e => {
                        e.stopPropagation();
                        onClose();
                    }}
                    content="Close"
                />
            </Modal.Actions>
        </Modal>
    ) : null;
}

ErrorCausesModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    errorCauses: PropTypes.arrayOf(PropTypes.shape({}))
};

ErrorCausesModal.defaultProps = {
    open: false,
    onClose: _.noop,
    errorCauses: []
};
