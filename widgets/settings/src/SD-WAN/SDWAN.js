/**
 * Created by Alex on 1/24/2017.
 */

const { Form } = Stage.Basic;
import Accordion from '../../../../app/components/basic/Accordion';
import Button from '../../../../app/components/basic/control/Button';

import Active from './Active';
import Backup from './Backup';
import Application from './Application';

const sdWANRadios = [{
        text: 'Active / Active',
        value: '0'
    }, {
        text: 'Active / Backup',
        value: '1'
    }
];

export default class SDWAN extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            status: this.props.source.status,
            applications: this.props.source.applicationsVisible
        };
    }

    _handleChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    _handleApplicationChange(proxy, field) {
        this.setState({applications: field.checked});
    }

    _callbackFromBackup( data ) {
        this.props.onUpdateTables( data, true );
        this.props.callbackSettings( "status", this.state.status );
    }

    _callbackFromApplications( data ) {
        this.props.onUpdateTables( data, false );
        this.props.callbackSettings( "applicationsVisible", this.state.applications );
    }

    _callbackFromActive() {
        this.props.callbackSettings( "status", this.state.status );
    }

    render() {
        let _options = [
            <Active
                onSaveData={this._callbackFromActive.bind(this)}
            ></Active>,
            <Backup
                source={this.props.source.interfaces}
                selectedItems={ this.props.source.interfacesSelectedItems }
                onSaveData={ (this._callbackFromBackup).bind(this) }
            ></Backup>,
            <Application
                source={this.props.source.applications}
                selectedItems={ this.props.source.applicationsSelectedItems }
                onSaveData={ (this._callbackFromApplications).bind(this) }
            ></Application>
        ];

        return (
            <div>
                <h3>SD-WAN Features</h3>
                <br/>
                <Form.Group>
                    <div>
                        {sdWANRadios.map(
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

                        { this.state.status !== ''
                            && _options[ this.state.status] }
                        <br/>
                        { this.state.status == 1 &&
                            <Form.Field>
                                <Form.Checkbox name='application'
                                               label="Applications"
                                               onChange={this._handleApplicationChange.bind(this)}
                                               checked={this.state.applications}
                                />
                            </Form.Field>
                        }
                        { this.state.status == 1 &&
                            this.state.applications && _options[ 2 ] }
                    </div>
                </Form.Group>

            </div>
        )
    }
}
