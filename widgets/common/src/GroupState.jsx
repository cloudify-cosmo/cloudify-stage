function GroupState({ state, className, description, onClick, value }) {
    const { Segment, Icon, Popup } = Stage.Basic;
    const disabled = value === 0;
    const color = disabled ? 'grey' : state.colorSUI;

    return (
        <Popup
            header={_.capitalize(state.name)}
            content={description}
            trigger={
                <Segment.Group className={className} disabled={disabled} onClick={onClick}>
                    <Segment color={color} disabled={disabled} inverted textAlign="center">
                        <Icon fitted name={state.icon} />
                    </Segment>
                    <Segment color={color} disabled={disabled} tertiary inverted textAlign="center">
                        {value}
                    </Segment>
                </Segment.Group>
            }
        />
    );
}

/**
 * @property {number} value - the number of members in the group
 * @property {Function} onClick - action to be executed on click event
 * @property {object} state - the details of the state including name, icon and color
 * @property {string} className - name of the style class to be added
 * @property {object} description - the description of the state
 */
GroupState.propTypes = {
    value: PropTypes.number,
    onClick: PropTypes.func,
    state: PropTypes.shape({
        name: PropTypes.string.isRequired,
        colorSUI: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired
    }).isRequired,
    className: PropTypes.string.isRequired,
    description: PropTypes.element.isRequired
};

GroupState.defaultProps = {
    value: 0,
    onClick: () => {}
};

Stage.defineCommon({
    name: 'GroupState',
    common: GroupState
});
