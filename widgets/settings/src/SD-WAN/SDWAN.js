/**
 * Created by Alex on 1/24/2017.
 */

const { Form } = Stage.Basic;
import Accordion from '../../../../app/components/basic/Accordion';

import Active from './Active';
import Backup from './Backup';
import Application from './Application';

export default class SDWAN extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            status: ''
        }
    }

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
        console.log(field)
        this.setState(Form.fieldNameValue(field));
    }

    _options = [
        <Active></Active>,
        <Backup></Backup>,
        <Application></Application>
    ];

    render() {
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
                        { this.state.status !== '' && this._options[ +this.state.status] }
                    </div>
                </Form.Group>

            </div>
        )
    }
}
