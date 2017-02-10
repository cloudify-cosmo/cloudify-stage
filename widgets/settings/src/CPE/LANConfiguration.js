/**
 * Created by jakub on 2/1/17.
 */

const { Form } = Stage.Basic;
import Segment from '../../../../app/components/basic/Segment';
import Button from '../../../../app/components/basic/control/Button';

import debounceErrorCheck from './AddressValidation';

const LAN_Configuration_prefix = "LAN_Configuration";
const Voice_LAN_Configuration_Prefix = "Voice_LAN_Configuration";

export default class LANConfiguration extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = this.setupState( props );
    }

    setupState( props ) {
        let cpeJSONFields = props['data-cpe'];
        let data = {};
        /*
            Convert { "0": {"key":"value"} } to { "key": "value" }
         */
        cpeJSONFields.forEach( field => { let keys = Object.keys(field); data[keys[0]] = field[keys[0]]; } );

        data.originalFields = Object.keys( data );

        if( data == undefined || data == null ) return {};

        data.siteValue = props['data-site-value'];
        data.errors = {};
        data.errorsTexts = [];

        data.privateLANDefault = {}; //props['data-cpe']['private_lan_default_values'];
        data.privateLANDefaultOptions = Object.keys(data.privateLANDefault).map(key => ({ text: key, value: key }) );

        data.const = props['data-const'];

        return data;
    }

    componentWillReceiveProps( nextProps ) {
       this.setState( this.setupState( nextProps ));
    }

    _handleChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));

        if( this._debounceErrorTimer !== null ) clearTimeout( this._debounceErrorTimer);
        this._debounceErrorTimer = setTimeout(() => {
                const errors = debounceErrorCheck(field, this);
                if(errors){
                    this.setState(errors);
                }
            },500
        );
    }

    _handleSubmit(data) {
        if( this.state.errorsTexts.length == 0 ){
            let currentValues = this.state;
            let formatObject = [];
            let originalFields = this.state.originalFields;

            Object.keys( currentValues )
                .filter( formElement => {
                    return originalFields.indexOf(formElement) > -1
                })
                .forEach( formElementKey => {
                    let arrayElement = {};
                    arrayElement[formElementKey] = currentValues[formElementKey];
                    formatObject.push(arrayElement);
                });

            this.props.onDataSave( formatObject, this.state.siteValue );

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
            LAN_Configuration_Private_LAN_Subnet_Address: this.state.privateLANDefault[defaultLAN]['subnet_address'],
            LAN_Configuration_Private_LAN_Subnet_Mask: this.state.privateLANDefault[defaultLAN]['subnet_mask'],
            LAN_Configuration_Private_LAN_Default_Gateway: this.state.privateLANDefault[defaultLAN]['default_getaway'],
        });

        /* remove any errors on these fields */
        const validateDefaultFromCombo = [
            {name: 'LAN_Configuration_Private_LAN_Subnet_Address', 'data-validate': 'ipv4', 'value': ''},
            {name: 'LAN_Configuration_Private_LAN_Subnet_Mask', 'data-validate': 'ipv4', 'value': ''},
            {name: 'LAN_Configuration_Private_LAN_Default_Gateway', 'data-validate': 'ipv4', 'value': ''}];

        validateDefaultFromCombo.forEach(function( validateDefaultValue ){
            const errors = debounceErrorCheck( validateDefaultValue, this);
            this.setState(errors);
        }.bind(this));
    }

    _getFieldClass(id) {
        return this.state.errors['LAN_Configuration_' + id] === undefined ? '' :
            this.state.errors['LAN_Configuration_' + id].class;
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
                                    name={'LAN_Configuration_' + item.value}
                                    data-text={item.text}
                                    key={ "input_" + index }
                                    value={this.state['LAN_Configuration_' + item.value]}
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