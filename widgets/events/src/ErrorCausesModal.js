/**
 * Created by jakub.niezgoda on 29/10/2018.
 */

export default class ErrorCausesModal extends React.Component {

    constructor(props, context){
        super(props, context);
    }

    static propTypes = {
        open: PropTypes.bool,
        onClose: PropTypes.func,
        errorCauses: PropTypes.array
    };

    static defaultProps = {
        open: false,
        onClose: _.noop,
        errorCauses: []
    };

    render() {
        let {JsonUtils} = Stage.Common;
        let {CancelButton, CopyToClipboardButton, Divider, Header, HighlightText, Message, Modal, Segment} = Stage.Basic;
        const numberOfErrorCauses = _.size(this.props.errorCauses);

        return numberOfErrorCauses > 0
            ?
                <Modal open={this.props.open} onClose={this.props.onClose}>
                    <Modal.Header>
                        Error Causes
                    </Modal.Header>
                    <Modal.Content scrolling>
                        {
                            _.map(this.props.errorCauses, ({message, traceback, type}, index) =>
                                <Segment key={`errorCause_${index}`} basic>
                                    {
                                        numberOfErrorCauses > 1 &&
                                        <React.Fragment>
                                            <Header size='medium'>Error Cause #{index + 1}</Header>
                                            <Divider/>
                                        </React.Fragment>
                                    }
                                    <Header size='small'>Type</Header>
                                    <Message info>{type}</Message>
                                    <Header size='small'>Message</Header>
                                    <Message error>{message}</Message>
                                    <Header size='small'>Traceback</Header>
                                    <HighlightText className='python'>{traceback}</HighlightText>
                                </Segment>
                            )
                        }
                    </Modal.Content>
                    <Modal.Actions>
                        <CopyToClipboardButton content='Copy Error Causes' text={JsonUtils.stringify(this.props.errorCauses, true)} />
                        <CancelButton onClick={(e) => {e.stopPropagation(); this.props.onClose()}} content="Close" />
                    </Modal.Actions>
                </Modal>
            :
                null;
    }
}