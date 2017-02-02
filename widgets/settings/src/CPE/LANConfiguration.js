/**
 * Created by jakub on 2/1/17.
 */

const { Form } = Stage.Basic;
import Segment from '../../../../app/components/basic/Segment';
import Button from '../../../../app/components/basic/control/Button';

const privateLAN = [
    {
        text: 'Subnet Address',
        value: 'subnet_address'
    },
    {
        text: 'Subnet Mask',
        value: 'subnet_mask'
    },
    {
        text: 'Default Gateway',
        value: 'default_gateway'
    }
];
const privateLANDHCP = [
    {
        text: 'DHCP Range',
        value: 'dh'
    },
    {
        text: 'DHCP Exclude',
        value: 'DHCP Range'
    }
];
const privateLANStaticAllocation = [
    {
        text: 'Static Allocation MAC',
        value: 'static_allocation_mac'
    },
    {
        text: 'Static Allocation IP',
        value: 'static_allocation_ip'
    }
];

export default class LANConfiguration extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            lan_default_private_lan: '',
            lan_subnet_address: '',
            lan_subnet_mask: '',
            lan_default_gateway: '',

            lan_dhcp_range: '',
            lan_dhcp_exclude_list: '',
            lan_static_allocation_mac: '',
            lan_static_allocation_ip: '',

            lan_dns_primary: '',
            lan_dns_pecondary: '',

            lan_public_subnet_address: '',
            lan_public_subnet_mask: '',

            errors: {}
        }
    }

    _validateIP(value) {
        let regex = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;

        return regex.test(value);
    }

    _handleChange(proxy, field) {
        console.log(field)
        field.error = true;
        console.log(field)
        this.setState(Form.fieldNameValue(field));
    }

    _handleSubmit(data) {
        console.log(data);
    }

    render() {
        return (
        <Form onSubmit={this._handleSubmit.bind(this)} errors={this.state.errors}>
            <Form.Group>
                <Segment vertical>
                    {privateLAN.map(
                        (item, index) => (
                            <div>
                                <Form.Field key={index}>
                                    <label>{item.text}</label>
                                    <Form.Input placeholder={item.text}
                                                name={'lan_' + item.value}
                                                value={this.state['lan_' + item.value]}
                                                onChange={this._handleChange.bind(this)}
                                                error={ this._validateIP(this.value) }
                                                data-validate="ipv4"
                                    />
                                </Form.Field>
                                <br/>
                            </div>
                        )
                    )}
                </Segment>
            </Form.Group>

            <Button positive type='submit'>Save</Button>
        </Form> );
    }

};