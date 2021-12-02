// @ts-nocheck File not migrated fully to TS

export default class ConsoleIcon extends React.Component {
    handleClick = event => {
        const { redirectToPage, url } = Stage.Utils.Url;
        const managerDefaultProtocol = 'https';
        const { manager } = this.props;

        event.stopPropagation();
        redirectToPage(`${managerDefaultProtocol}://${manager.ip}${url('')}`);
    };

    render() {
        const { Icon, Popup } = Stage.Basic;
        const { manager } = this.props;

        return (
            manager.ip && (
                <Popup
                    trigger={<Icon name="computer" link bordered onClick={this.handleClick} />}
                    content="Open Console"
                />
            )
        );
    }
}

ConsoleIcon.propTypes = {
    manager: PropTypes.shape({ ip: PropTypes.string })
};

ConsoleIcon.defaultProps = {
    manager: { ip: '' }
};
