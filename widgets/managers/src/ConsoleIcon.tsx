// @ts-nocheck File not migrated fully to TS

const t = Stage.Utils.getT('widgets.managers.actions');

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
                <Popup trigger={<Icon name="computer" link onClick={this.handleClick} />} content={t('openConsole')} />
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
