/**
 * Created by jakub on 2/1/17.
 */

const { Form } = Stage.Basic;
import Segment from '../../../../app/components/basic/Segment';
import Button from '../../../../app/components/basic/control/Button';

import _debounceErrorCheck from '../Additional/SharedFunctions';

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


const privateLANDefault = Object.keys(privateLanDefaultValues).map(key => ({ text: key, value: key }) );

export default class LANConfiguration extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = this.setupState( props );
    }

    setupState( props ) {
        let data = props['data-cpe']['LAN'];

        if( data == undefined || data == null ) return {};

        if( Object.keys(data).length === 0 ) {
            data = {
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
                lan_public_subnet_mask: ''
            }
        }

        data.siteValue = props['data-cpe'].value;
        data.errors = {};
        data.errorsTexts = [];

        data.saveData = props['save-data'];

        return data;
    }

    componentWillReceiveProps( nextProps ) {
       this.setState( this.setupState( nextProps ));
    }

    _debounceErrorTimer = null;

    _handleChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
        if( this._debounceErrorTimer !== null ) clearTimeout( this._debounceErrorTimer);
        this._debounceErrorTimer = setTimeout(() => _debounceErrorCheck(field, this), 500);
    }

    _handleSubmit(data) {
        console.log('---')
        console.log( this.state.saveData )
        console.log('---')

        this.state.saveData( data, this.state.siteValue );
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
                <div key={ index } className="column">
                    <Form.Field className={ this._getFieldClass( item.value ) } >
                        <label>{item.text}</label>
                        <Form.Input placeholder={item.text}
                                    name={'lan_' + item.value}
                                    data-text={item.text}
                                    key={ "input_" + index }
                                    value={this.state['lan_' + item.value]}
                                    onChange={this._handleChange.bind(this)}
                                    data-validate={item.validate}
                        />
                    </Form.Field>
                    { index !== list.length-1 && <br/> }
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