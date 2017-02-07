/**
 * Created by jakub on 2/1/17.
 */

const { Form } = Stage.Basic;
import Segment from '../../../../app/components/basic/Segment';
import Button from '../../../../app/components/basic/control/Button';

import debounceErrorCheck from './AddressValidation';


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

        data.privateLANDefault =  props['data-cpe']['private_lan_default_values'];
        data.privateLANDefaultOptions = Object.keys(data.privateLANDefault).map(key => ({ text: key, value: key }) );

        data.const = props['data-const'];

        return data;
    }

    componentWillReceiveProps( nextProps ) {
       this.setState( this.setupState( nextProps ));
    }

    _debounceErrorTimer = null;

    _handleChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));

        if( this._debounceErrorTimer !== null ) clearTimeout( this._debounceErrorTimer);
        this._debounceErrorTimer = setTimeout(() => debounceErrorCheck(field, this), 500);
    }

    _handleSubmit(data) {
        if( this.state.errorsTexts.length == 0 ){
            this.props['save-data']( data, this.state.siteValue );

            this.setState({savingData: true});
            setTimeout(function(){
                this.setState( {savingData: false} );
            }.bind(this), 400);
        }
    }

    _setDefaultPrivateLAN(proxy, field) {
        this.setState(Form.fieldNameValue(field));

        let defaultLAN = field.value;

        this.setState( {
            lan_subnet_address: this.state.privateLANDefault[defaultLAN]['subnet_address'],
            lan_subnet_mask: this.state.privateLANDefault[defaultLAN]['subnet_mask'],
            lan_default_gateway: this.state.privateLANDefault[defaultLAN]['default_getaway'],
        });

        /* remove any errors on these fields */
        debounceErrorCheck( {name: 'lan_subnet_address', 'data-validate': 'ipv4', 'value': ''}, this);
        debounceErrorCheck( {name: 'lan_subnet_mask', 'data-validate': 'ipv4', 'value': ''}, this);
        debounceErrorCheck( {name: 'lan_default_getaway', 'data-validate': 'ipv4', 'value': ''}, this);
    }

    _getFieldClass(id) {
        return this.state.errors['lan_' + id] === undefined ? '' :
            this.state.errors['lan_' + id].class;
    }

    _getIsEditable( value ) {
        return value !== undefined && value === false;
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
                                                   options={this.state.privateLANDefaultOptions}
                                                   value={this.state.lan_default_private_lan}
                                                   onChange={this._setDefaultPrivateLAN.bind(this)}/>
                                </Form.Field>
                            </div>
                            <br/>

                            {this._renderFieldGroup(this.state.const.privateLAN)}
                        </Form.Group>


                        <Form.Group className="column">
                            <h3>Private LAN DHCP</h3>
                            {this._renderFieldGroup(this.state.const.privateLANDHCP)}
                            <br/>
                            <div className="ui grid equal width">
                                {this._renderFieldGroup(this.state.const.privateLANStaticAllocation)}
                            </div>
                        </Form.Group>
                    </div>

                    <div className="row">

                        <Form.Group className="column">
                            <h3>DNS</h3>
                            {this._renderFieldGroup(this.state.const.dns)}
                        </Form.Group>

                        <Form.Group className="column">
                            <h3>Public LAN</h3>
                            {this._renderFieldGroup(this.state.const.publicLAN)}
                        </Form.Group>

                    </div>
                </div>

            <br/>
            <Button disabled={this.state.errorsTexts.length !== 0} loading={this.state.savingData} positive type='submit'>Save</Button>
        </Form> );
    }

};