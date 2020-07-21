/**
 * Created by edenp on 22/10/2017.
 */

export default class RolesPicker extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        onUpdate: PropTypes.func.isRequired,
        resources: PropTypes.shape({}).isRequired,
        resourceName: PropTypes.string.isRequired,
        toolbox: Stage.PropTypes.Toolbox.isRequired
    };

    handleInputChange(proxy, field) {
        const { onUpdate } = this.props;
        onUpdate(field.name, field.value);
    }

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
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    );
                })}
            </span>
        );
    }
}

Stage.defineCommon({
    name: 'RolesPicker',
    common: RolesPicker
});
