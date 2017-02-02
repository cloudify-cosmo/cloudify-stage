/**
 * Created by Alex on 1/24/2017.
 */

import { Segment, Button } from 'semantic-ui-react'
const { Form } = Stage.Basic;
import Accordion from '../../../../app/components/basic/Accordion';

import LANConfiguration from './LANConfiguration';
import VoiceLANConfiguration from './VoiceLANConfiguration';

const siteOptions = [{
    text: 'Haifa',
    value: 'haifa'
}, {
    text: 'Tel Aviv',
    value: 'telaviv'
}, {
    text: 'Jerusalem',
    value: 'jerusalem'
}, {
    text: 'Eilat',
    value: 'eilat'
}];

const statusRadiobuttons = [{
    text: 'Active / Active',
    value: 'active'
}, {
    text: 'Active / Standby',
    value: 'standby'
}, {
    text: 'Application Load Balancing',
    value: 'lb'
}];
const groupOptions = [{
    text: 'App Group 1',
    value: '1'
}, {
    text: 'App Group 2',
    value: '2'
}, {
    text: 'App Group 3',
    value: '3'
}, {
    text: 'App Group 4',
    value: '4'
}];



export default class CPE extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            site: "",
            status: "",
            group: "",
            errors: {}
        }
    }

    _handleChange(proxy, field) {
        console.log(Form.fieldNameValue(field));

        this.setState(Form.fieldNameValue(field));
    }

    _handleSubmit(data) {
        console.log(data);
    }

    panels = [
        {title: 'LAN Configuration', content: <LANConfiguration/> },
        {title: 'Voice LAN Configuration', content: <VoiceLANConfiguration/>}
    ];

    render() {
        return (
            <div>
                <Form.Group>
                    <Form.Field>
                        <div>Select Site</div>
                        <Form.Dropdown name='site'
                                       selection
                                       options={siteOptions}
                                       value={this.state.site}
                                       onChange={this._handleChange.bind(this)}/>
                    </Form.Field>
                </Form.Group>
                <br/>
                <Accordion styled panels={this.panels} className="fluid" />

            </div>
        )
    }
}
