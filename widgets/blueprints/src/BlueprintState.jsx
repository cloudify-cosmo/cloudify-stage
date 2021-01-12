export default function BlueprintState({ blueprint }) {
    const { Icon, Popup } = Stage.Basic;
    return (
        <>
            {_.words(_.startCase(blueprint.state))[0]}
            {blueprint.error && (
                <Popup
                    offset={[-11, 0]}
                    trigger={<Icon link name="warning circle" color="red" />}
                    content={blueprint.error}
                    header={_.capitalize(_.startCase(blueprint.state))}
                />
            )}
        </>
    );
}

BlueprintState.propTypes = {
    blueprint: PropTypes.shape({
        state: PropTypes.string,
        error: PropTypes.string
    }).isRequired
};
