/**
 * Created by jakub on 2/1/17.
 */

const { Form } = Stage.Basic;
import Segment from '../../../../app/components/basic/Segment';
import Button from '../../../../app/components/basic/control/Button';

import debounceErrorCheck from './AddressValidation';
import Actions from '../actions';


export default class VoiceLANConfiguration extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = this.setupState(props);
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

    _getFieldClass(id) {
        return this.state.errors['Voice_LAN_Configuration_' + id] === undefined ? '' :
            this.state.errors['Voice_LAN_Configuration_' + id].class;
    }

    _callAllocate( fieldName ) {
        const actions = new Actions(this.props.toolbox);
        const allocateFieldName = 'allocate_' + fieldName;
        let newValues = {};

        if( this.state[allocateFieldName] === undefined || this.state[allocateFieldName] === false ) {
            let promise = actions.allocateFromDataBase(
                0, 0,
                fieldName
            );

            promise.then(function(value){
                newValues[fieldName] = value;
                newValues[allocateFieldName] = true;

                this.setState(newValues);

                /* remove any errors on these fields */
                const errors = debounceErrorCheck( {name: fieldName, 'data-validate': '', 'value': ''}, this);
                this.setState(errors);

            }.bind(this));
        }else{
            let promise = actions.releaseFromDataBase(
                0, 0,
                fieldName
            );

            promise.then(function(value){
                newValues[allocateFieldName] = false;

                this.setState(newValues)
            }.bind(this));
        }
    }

    _checkIfAllocated( name ) {
        return this.state['allocate_' + 'Voice_LAN_Configuration_' + name] === undefined ||
            this.state['allocate_' + 'Voice_LAN_Configuration_' + name] === false;
    }

    _renderFieldGroup( list ) {
        return list.map(
            (item, index) => (
                <div key={ index } className="column">
                    <Form.Field className={ this._getFieldClass( item.value ) } >
                        <div>
                            <label>{item.text}</label>
                            {
                                item.allocate !== undefined &&
                                <Button
                                    type="button"
                                    size="tiny"
                                    compact={true}
                                    floated="right"
                                    color="blue"
                                    onClick={ () => this._callAllocate('Voice_LAN_Configuration_' + item.value) }
                                >
                                    <i className="cloud download icon"></i>
                                    {
                                        this._checkIfAllocated(item.value) ?
                                            "Allocate" : "Release"
                                    }
                                </Button>
                            }
                        </div>
                        <br/>
                        <div>
                            <Form.Input placeholder={item.text}
                                        name={'Voice_LAN_Configuration_' + item.value}
                                        data-text={item.text}
                                        key={ "input_" + index }
                                        value={this.state['Voice_LAN_Configuration_' + item.value]}
                                        onChange={this._handleChange.bind(this)}
                                        data-validate={item.validate}
                                        disabled={!this._checkIfAllocated(item.value)}
                            />
                        </div>
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
                            <h3>Voice LAN</h3>

                            {this._renderFieldGroup(this.state.const.voiceLAN)}
                        </Form.Group>


                        <Form.Group className="column">
                            <h3>Voice LAN DHCP</h3>
                            {this._renderFieldGroup(this.state.const.voiceLANDHCP)}
                            <br/>
                            <div className="ui grid equal width">
                                {this._renderFieldGroup(this.state.const.voiceLANStaticAllocation)}
                            </div>
                        </Form.Group>
                    </div>

                </div>

                <br/>
                <Button disabled={this.state.errorsTexts.length !== 0} loading={this.state.savingData} positive type='submit'>Save</Button>
            </Form> );
    }

};