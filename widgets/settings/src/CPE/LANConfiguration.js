/**
 * Created by jakub on 2/1/17.
 */

const { Form } = Stage.Basic;
import Segment from '../../../../app/components/basic/Segment';
import Button from '../../../../app/components/basic/control/Button';

import guid from '../guid';

const privateLAN = [
    {
        text: 'Subnet Address',
        value: 'subnet_address',
        validate: 'ipv4',
    },
    {
        text: 'Subnet Mask',
        value: 'subnet_mask',
        validate: 'ipv4',
    },
    {
        text: 'Default Gateway',
        value: 'default_gateway',
        validate: 'ipv4',
    }
];
const privateLANDHCP = [
    {
        text: 'DHCP Range',
        value: 'dhcp_range',
        validate: 'ipv4',
    },
    {
        text: 'DHCP Exclude',
        value: 'dhcp_exclude',
        validate: 'ipv4',
    }
];
const privateLANStaticAllocation = [
    {
        text: 'Static Allocation MAC',
        value: 'static_allocation_mac',
        validate: 'mac',
    },
    {
        text: 'Static Allocation IP',
        value: 'static_allocation_ip',
        validate: 'ipv4',
    }
];
const dns = [
    {
        text: 'DNS Primary',
        value: 'dns_primary'
    },
    {
        text: 'DNS Secondary',
        value: 'dns_secondary'
    }
];
const publicLAN = [
    {
        text: 'Subnet address',
        value: 'public_subnet_adress'
    },
    {
        text: 'Subnet mask',
        value: 'public_subnet_mask'
    }
];
const privateLanDefaultValues = {
    '192.168.1.1': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    },
    '10.0.1.0': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    },
    '255.255.255.0': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    },
    '10.0.1.1': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    },
    '172.16.1.0': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    },
    '172.16.1.1': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    }
};

const ipv4ErrorMessage = ' has to be a proper IPv4 address.';
const macErrorMessage = ' has to be a proper MAC address';


const privateLANDefault = Object.keys(privateLanDefaultValues).map(key => ({ text: key, value: key }) );

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

            errors: {},
            errorsTexts: [],
        }
    }

    _validateIP(value) {
        let _ipv4Regex = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
        return _ipv4Regex.test(value);
    }

    _validateMAC(value) {
        let _macRegex = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/;
        return _macRegex.test(value);
    }

    _isError(key) {
        return (this.state.errors[key] !== undefined && this.state.errors[key] === true );
    }

    _handleChange(proxy, field) {

        this.setState(Form.fieldNameValue(field));

        let errors = this.state.errors;
        if( field['data-validate'] !== undefined ) {

            let className = field['data-validate'] === 'ipv4' ?
                (this._validateIP(field.value) ? "" : "error") :
                (this._validateMAC(field.value) ? "" : "error");

            errors[field.name] = {
                class: field.value === '' ? '' : className,
                type: field['data-validate'],
                name: field['data-text']
            };
        }

        let errorsTexts = Object.keys(errors).map( key =>
            errors[key].class === '' ? undefined :
                ( "Field " + errors[key].name +
                (errors[key].type === 'ipv4' ? ipv4ErrorMessage :
                        errors[key].type === 'mac' ? macErrorMessage : ''
                ))
        ).filter(x => (typeof x === 'string'));

        this.setState({
            errors,
            errorsTexts
        });
    }

    _handleSubmit(data) {
        console.log(data);
    }

    _setDefaultPrivateLAN(proxy, field) {
        this.setState(Form.fieldNameValue(field));

        let defaultLAN = field.value;

        this.setState( {
            lan_subnet_address: privateLanDefaultValues[defaultLAN]['subnet_address'],
            lan_subnet_mask: privateLanDefaultValues[defaultLAN]['subnet_mask'],
            lan_default_gateway: privateLanDefaultValues[defaultLAN]['default_getaway'],
        } );
    }

    _getFieldClass(id) {
        return this.state.errors['lan_' + id] === undefined ? '' :
            this.state.errors['lan_' + id].class;
    }

    _renderFieldGroup( list ) {
        return list.map(
            (item, index) => (
                <div key={guid() + index}>
                    <Form.Field className={ this._getFieldClass( item.value ) } >
                        <label>{item.text}</label>
                        <Form.Input placeholder={item.text}
                                    name={'lan_' + item.value}
                                    data-text={item.text}
                                    value={this.state['lan_' + item.value]}
                                    onChange={this._handleChange.bind(this)}
                                    data-validate={item.validate}
                        />
                    </Form.Field>
                    { index !== privateLAN.length-1 && <br/> }
                </div>
            )
        )
    }

    render() {
        return (
        <Form onSubmit={this._handleSubmit.bind(this)} errors={this.state.errorsTexts}>
                <div className="ui grid equal width">
                    <div className="row">
                        <Form.Group className="column">
                            <h3>Private LAN</h3>

                            <div>
                                <Form.Field>
                                    <label>Set default values</label>
                                    <Form.Dropdown name='lan_default_private_lan'
                                                   selection
                                                   options={privateLANDefault}
                                                   value={this.state.lan_default_private_lan}
                                                   onChange={this._setDefaultPrivateLAN.bind(this)}/>
                                </Form.Field>
                            </div>
                            <br/>

                            {this._renderFieldGroup(privateLAN)}
                        </Form.Group>


                        <Form.Group className="column">
                            <h3>Private LAN DHCP</h3>
                            {this._renderFieldGroup(privateLANDHCP)}
                            <br/>
                            <div className="ui grid equal width">
                                {this._renderFieldGroup(privateLANStaticAllocation)}
                            </div>
                        </Form.Group>
                    </div>

                    <div className="row">

                        <Form.Group className="column">
                            <h3>DNS</h3>
                            {this._renderFieldGroup(dns)}
                        </Form.Group>

                        <Form.Group className="column">
                            <h3>Public LAN</h3>
                            {this._renderFieldGroup(publicLAN)}
                        </Form.Group>

                    </div>
                </div>

            <br/>
            <Button positive type='submit'>Save</Button>
        </Form> );
    }

};