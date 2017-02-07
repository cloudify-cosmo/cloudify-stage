/**
 * Created by Alex on 1/24/2017.
 */

import { Segment, Button } from 'semantic-ui-react'

const { Form } = Stage.Basic;

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

export default class ACL extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            status: '',
            group: '',
            errors: {}
        }
    }

    _handleChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    _handleSubmit(data) {
    }

    render() {
        return (
            <Form onSubmit={this._handleSubmit.bind(this)} errors={this.state.errors}>
                <label>Status</label>
                <Form.Group>
                    <Segment>
                        {statusRadiobuttons.map(
                            item => (
                                <Form.Field key={item.value}>
                                    <Form.Radio name='status'
                                                label={item.text}
                                                value={item.value}
                                                checked={item.value === this.state.status}
                                                onChange={this._handleChange.bind(this)}/>
                                </Form.Field>
                            )
                        )}
                    </Segment>
                </Form.Group>

                <Form.Group>
                    <Form.Dropdown name='group'
                                   selection
                                   placeholder='Application Group'
                                   options={groupOptions}
                                   value={this.state.group}
                                   onChange={this._handleChange.bind(this)}
                                   disabled={this.state.status !== 'lb'}/>
                </Form.Group>

                <Button positive type='submit'>Save</Button>
            </Form>
        )
    }
}
