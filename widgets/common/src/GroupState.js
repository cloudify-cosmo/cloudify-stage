import PropTypes from 'prop-types';

class GroupState extends React.Component {
    /**
     * propTypes
     *
     * @property {number} value - the number of members in the group
     * @property {Function} onClick - action to be executed on click event
     * @property {object} state - the details of the state including name, icon and color
     * @property {string} className - name of the style class to be added
     * @property {object} description - the description of the state
     */
    static propTypes = {
        value: PropTypes.number,
        onClick: PropTypes.func,
        state: PropTypes.shape({
            name: PropTypes.string.isRequired,
            colorSUI: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired
        }).isRequired,
        className: PropTypes.string.isRequired,
        description: PropTypes.object.isRequired
    };

    static defaultProps = {
        value: 0,
        onClick: () => {}
    };

    render() {
        const { Segment, Icon, Popup } = Stage.Basic;
        const disabled = this.props.value === 0;
        const { state } = this.props;
        const color = disabled ? 'grey' : state.colorSUI;

        return (
            <Popup
                header={_.capitalize(state.name)}
                content={this.props.description}
                trigger={
                    <Segment.Group className={this.props.className} disabled={disabled} onClick={this.props.onClick}>
                        <Segment color={color} disabled={disabled} inverted>
                            <Icon name={state.icon} />
                        </Segment>
                        <Segment color={color} disabled={disabled} tertiary inverted>
                            {this.props.value}
                        </Segment>
                    </Segment.Group>
                }
            />
        );
    }
}

Stage.defineCommon({
    name: 'GroupState',
    common: GroupState
});
