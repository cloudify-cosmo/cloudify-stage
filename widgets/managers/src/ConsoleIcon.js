/**
 * Created by jakub.niezgoda on 25/10/2018.
 */

export default class ConsoleIcon extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        manager: PropTypes.object
    };

    static defaultProps = {
        manager: { ip: '' }
    };

    handleClick(event) {
        const { redirectToPage, url } = Stage.Utils.Url;
        const managerDefaultProtocol = 'https';
        const { ip } = this.props.manager;

        event.stopPropagation();
        redirectToPage(`${managerDefaultProtocol}://${ip}${url('')}`);
    }

    render() {
        const { Icon, Popup } = Stage.Basic;
        const { ip } = this.props.manager;

        return (
            ip && (
                <Popup
                    trigger={<Icon name="computer" link bordered onClick={this.handleClick.bind(this)} />}
                    content="Open Console"
                />
            )
        );
    }
}
