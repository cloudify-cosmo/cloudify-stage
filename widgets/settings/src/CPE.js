/**
 * Created by Alex on 1/24/2017.
 */

import { Segment, Button } from 'semantic-ui-react'

const { Form } = Stage.Basic;

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
const lan = [{
    text: 'Subnet',
    value: 'subnet'
}, {
    text: 'Subnet Mask',
    value: 'subnetMask'
}, {
    text: 'DHCP Range',
    value: 'dhcpRange'
}, {
    text: 'DHCP Excludelist',
    value: 'dhcpExcludelist'
}, {
    text: 'DNS Primary',
    value: 'dnsPrimary'
}, {
    text: 'DNS Secondary',
    value: 'dnsSecondary'
}, {
    text: 'Primary',
    value: 'primary'
}, {
    text: 'Voice',
    value: 'voice'
}, {
    text: 'IP Address',
    value: 'ipAddress'
}];

export default class CPE extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            site: "haifa",
            status: "",
            group: "",
            lan_subnet: '',
            lan_subnetMask: '',
            lan_dhcpRange: '',
            lan_dhcpExcludelist: '',
            lan_dnsPrimary: '',
            lan_dnsSecondary: '',
            lan_primary: '',
            lan_voice: '',
            lan_ipAddress: '',
            errors: {}
        }
    }

    _handleChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    _handleSubmit(data) {
        console.log(data);
    }

    render() {
        return (
            <Form onSubmit={this._handleSubmit.bind(this)} errors={this.state.errors}>
                <label>Select Site</label>
                <Form.Group>
                    <Form.Dropdown name='group'
                                   selection
                                   options={siteOptions}
                                   value={this.state.site}
                                   onChange={this._handleChange.bind(this)}/>
                </Form.Group>


                <label>Set Load Balance</label>
                <Form.Group>
                    <Segment vertical>
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

                <label>Lan Configuration</label>
                <Form.Group>
                    <Segment vertical>
                        {lan.map(
                            item => (
                                <Form.Field key={item.value}>
                                    <label>{item.text}</label>
                                    <Form.Input placeholder={item.text}
                                                name={'lan_' + item.value}
                                                value={this.state['lan_' + item.value]}
                                                onChange={this._handleChange.bind(this)}/>
                                </Form.Field>
                            )
                        )}
                    </Segment>
                </Form.Group>

                <Button positive type='submit'>Save</Button>
            </Form>
        )
    }
}
