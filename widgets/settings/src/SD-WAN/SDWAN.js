/**
 * Created by Alex on 1/24/2017.
 */

const { Form } = Stage.Basic;
import Accordion from '../../../../app/components/basic/Accordion';
import Button from '../../../../app/components/basic/control/Button';

import Active from './Active';
import Backup from './Backup';
import Application from './Application';

export default class SDWAN extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            status: ''
        };

        this._callbackToWrapper = props.callback;
    }

    _callbackToWrapper = null;

    sdWANRadios = [{
        text: 'Active / Active',
        value: '0'
    }, {
        text: 'Active / Backup',
        value: '1'
    }, {
        text: 'Application',
        value: '2'
    }];

    _handleChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    _backup = {};
    _applications = {};

    _callbackFromBackup( data ) {
        this._callbackToWrapper( data, true );
    }

    _callbackFromApplications( data ) {
        this._callbackToWrapper( data, false );
    }

    render() {
        let _options = [
            <Active></Active>,
            <Backup
                source={this.props.source.interfaces}
                selectedItems={ this.props.source.interfacesSelectedItems }
                callback={ (this._callbackFromBackup).bind(this) }
            ></Backup>,
            <Application
                source={this.props.source.applications}
                selectedItems={ this.props.source.applicationsSelectedItems }
                callback={ (this._callbackFromApplications).bind(this) }
            ></Application>
        ];

        return (
            <div>
                <h3>SD-WAN Features</h3>
                <br/>
                <Form.Group>
                    <div>
                        {this.sdWANRadios.map(
                            (item, index) => (
                                <div key={index}>
                                    <Form.Field>
                                        <Form.Radio name='status'
                                                    label={item.text}
                                                    value={item.value}
                                                    checked={item.value === this.state.status}
                                                    onChange={this._handleChange.bind(this)}/>
                                    </Form.Field>
                                </div>
                            )
                        )}

                        <br/>
                        { this.state.status !== '' && _options[ +this.state.status] }
                    </div>
                </Form.Group>

            </div>
        )
    }
}
