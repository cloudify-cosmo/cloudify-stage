/**
 * Created by edenp on 22/10/2017.
 */
import _ from 'lodash';

let PropTypes = React.PropTypes;
const {Form} = Stage.Basic;

export default class RolesPicker extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        onUpdate: PropTypes.func.isRequired,
        resources: PropTypes.object.isRequired,
        resourceName: PropTypes.string.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    _handleInputChange(proxy, field){
        this.props.onUpdate(field.name, field.value);
    }

    render(){
        var roleOptions = _.reverse(_.map(_.filter(this.props.toolbox.getManager()._data.roles, {type: 'tenant_role'}), (role) => {
            return {text: role.name, value: role.name};
        }));

        return (
            <span>
                {
                    _.map(this.props.resources, (role, resource) => {
                        return (
                            <Form.Field key={resource}>
                                <label> Choose a role for {this.props.resourceName} {resource}:</label>
                                <Form.Dropdown placeholder='Choose a role' selection options={roleOptions} name={resource}
                                               value={role} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>
                        )
                    })
                }
            </span>
        )
    }
}


Stage.defineCommon({
    name: 'RolesPicker',
    common: RolesPicker
});