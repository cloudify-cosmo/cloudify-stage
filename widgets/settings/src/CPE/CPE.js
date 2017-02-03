/**
 * Created by Alex on 1/24/2017.
 */

const { Form } = Stage.Basic;
import Accordion from '../../../../app/components/basic/Accordion';

import LANConfiguration from './LANConfiguration';
import VoiceLANConfiguration from './VoiceLANConfiguration';

const siteOptions = [{
    text: 'Haifa',
    value: '0'
}, {
    text: 'Tel Aviv',
    value: '1'
}, {
    text: 'Jerusalem',
    value: '2'
}, {
    text: 'Eilat',
    value: '3'
}];

/* LAN config consts */
const privateLAN = [
    {
        text: 'Subnet Address',
        value: 'subnet_address',
        validate: 'ipv4',
    },
    {
        text: 'Subnet Mask',
        value: 'subnet_mask',
        validate: 'ipv4',
    },
    {
        text: 'Default Gateway',
        value: 'default_gateway',
        validate: 'ipv4',
    }
];
const privateLANDHCP = [
    {
        text: 'DHCP Range',
        value: 'dhcp_range',
        validate: 'ipv4',
    },
    {
        text: 'DHCP Exclude',
        value: 'dhcp_exclude',
        validate: 'ipv4',
    }
];
const privateLANStaticAllocation = [
    {
        text: 'Static Allocation MAC',
        value: 'static_allocation_mac',
        validate: 'mac',
    },
    {
        text: 'Static Allocation IP',
        value: 'static_allocation_ip',
        validate: 'ipv4',
    }
];
const dns = [
    {
        text: 'DNS Primary',
        value: 'dns_primary'
    },
    {
        text: 'DNS Secondary',
        value: 'dns_secondary'
    }
];
const publicLAN = [
    {
        text: 'Subnet address',
        value: 'public_subnet_adress'
    },
    {
        text: 'Subnet mask',
        value: 'public_subnet_mask'
    }
];
const privateLanDefaultValues = {
    '192.168.1.1': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    },
    '10.0.1.0': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    },
    '255.255.255.0': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    },
    '10.0.1.1': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    },
    '172.16.1.0': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    },
    '172.16.1.1': {
        subnet_address: '127.0.0.1',
        subnet_mask: '127.0.0.1',
        default_getaway: '192.168.1.1'
    }
};

const privateLANDefault = Object.keys(privateLanDefaultValues).map(key => ({ text: key, value: key }) );

const lanConfig = { privateLAN, privateLANDHCP, privateLANStaticAllocation, publicLAN, dns, privateLANDefault, privateLanDefaultValues };

/* Voice LAN config */
const voiceLAN = [
    {
        text: 'Subnet Address',
        value: 'subnet_address',
        validate: 'ipv4',
    },
    {
        text: 'Subnet Mask',
        value: 'subnet_mask',
        validate: 'ipv4',
    },
    {
        text: 'Default Gateway',
        value: 'default_gateway',
        validate: 'ipv4',
    }
];
const voiceLANDHCP = [
    {
        text: 'DHCP Range',
        value: 'dhcp_range',
        validate: 'ipv4',
    },
    {
        text: 'DHCP Exclude',
        value: 'dhcp_exclude',
        validate: 'ipv4',
    }
];
const voiceLANStaticAllocation = [
    {
        text: 'Static Allocation MAC',
        value: 'static_allocation_mac',
        validate: 'mac',
    },
    {
        text: 'Static Allocation IP',
        value: 'static_allocation_ip',
        validate: 'ipv4',
    }
];

const voiceConfig = { voiceLAN, voiceLANDHCP, voiceLANStaticAllocation };



const CPEs = siteOptions.map( site => ({ site: site.text, value: site.value, LAN: {}, voiceLAN: {} }) );

export default class CPE extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            site: 0,
            CPEs
        };
    }

    _handleChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    HandleLANConfig = function ( lanConfig, index ) {
        let CPEs = this.state.CPEs;

        CPEs[index].LAN = lanConfig;

        this.setState( CPEs );
    };

    HandleVoiceLANConfig = function ( voiceLANConfig, index ) {
        let CPEs = this.state.CPEs;

        CPEs[index].voiceLAN = voiceLANConfig;
        this.setState( CPEs );
    };

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
                                       text={siteOptions[this.state.site].text}
                                       onChange={this._handleChange.bind(this)}/>
                    </Form.Field>
                </Form.Group>
                <br/>
                <Accordion styled panels={[
                    {title: 'LAN Configuration',
                        content: <LANConfiguration
                        save-data={ this.HandleLANConfig.bind(this) }
                        data-cpe={this.state.CPEs[this.state.site]}
                        data-const={lanConfig}
                        /> },

                    {title: 'Voice LAN Configuration',
                        content: <VoiceLANConfiguration
                        save-data={ this.HandleVoiceLANConfig.bind(this) }
                        data-cpe={this.state.CPEs[this.state.site]}
                        data-const={voiceConfig}
                        />}
                ]} className="fluid" />

            </div>
        )
    }
}
