/**
 * Created by jakub.niezgoda on 16/08/2018.
 */

export default class NoResourceMessage extends React.Component {
    static propTypes = {
        resourceName: PropTypes.string.isRequired
    };

    render() {
        const { Message } = Stage.Basic;
        const { resourceName } = this.props;

        return (
            <Message
                success
                icon="checkmark"
                header={`No ${resourceName} required`}
                content="You can go to the next step."
            />
        );
    }
}
