// @ts-nocheck File not migrated fully to TS

export default class RolesPicker extends React.Component {
    handleInputChange = (proxy, field) => {
        const { onUpdate } = this.props;
        onUpdate(field.name, field.value);
    };

    render() {
        const { resourceName, resources, toolbox } = this.props;
        const { Form } = Stage.Basic;
        const roleOptions = _.reverse(
            _.map(_.filter(toolbox.getManagerState().roles, { type: 'tenant_role' }), role => {
                return { text: role.name, value: role.name };
            })
        );

        return (
            <span>
                {_.map(resources, (role, resource) => {
                    return (
                        <Form.Field key={resource} label={`Choose a role for ${resourceName} ${resource}:`}>
                            <Form.Dropdown
                                placeholder="Choose a role"
                                selection
                                options={roleOptions}
                                name={resource}
                                value={role}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>
                    );
                })}
            </span>
        );
    }
}

RolesPicker.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    resources: PropTypes.shape({}).isRequired,
    resourceName: PropTypes.string.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

Stage.defineCommon({
    name: 'RolesPicker',
    common: RolesPicker
});
