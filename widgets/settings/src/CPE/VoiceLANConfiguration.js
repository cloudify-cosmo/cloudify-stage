/**
 * Created by jakub on 2/1/17.
 */

const { Form } = Stage.Basic;
import Segment from '../../../../app/components/basic/Segment';
import Button from '../../../../app/components/basic/control/Button';

import debounceErrorCheck from './AddressValidation';



export default class VoiceLANConfiguration extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = this.setupState(props);
    }

    setupState( props ) {
        let data = props['data-cpe']['voiceLAN'];

        if( data == undefined || data == null ) return {};

        if( Object.keys(data).length === 0 ) {
            data = {
                voice_lan_subnet_address: '',
                voice_lan_subnet_mask: '',
                voice_lan_default_gateway: '',

                voice_lan_dhcp_range: '',
                voice_lan_dhcp_exclude_list: '',
                voice_lan_static_allocation_mac: '',
                voice_lan_static_allocation_ip: ''
            };
        }

        data.siteValue = props['data-cpe'].value;
        data.errors = {};
        data.errorsTexts = [];

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

    _getFieldClass(id) {
        return this.state.errors['voice_lan_' + id] === undefined ? '' :
            this.state.errors['voice_lan_' + id].class;
    }

    _renderFieldGroup( list ) {
        return list.map(
            (item, index) => (
                <div key={ index } className="column">
                    <Form.Field className={ this._getFieldClass( item.value ) } >
                        <label>{item.text}</label>
                        <Form.Input placeholder={item.text}
                                    name={'voice_lan_' + item.value}
                                    data-text={item.text}
                                    key={ "input_" + index }
                                    value={this.state['voice_lan_' + item.value]}
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