/**
 * Created by jakub on 2/9/17.
 */

/* LAN config consts */
const privateLAN = [
    {
        text: 'Subnet Address',
        value: 'Private_LAN_Subnet_Address',
        validate: 'ipv4',
    },
    {
        text: 'Subnet Mask',
        value: 'Private_LAN_Subnet_Mask',
        validate: 'ipv4',
    },
    {
        text: 'Default Gateway',
        value: 'Private_LAN_Default_Gateway',
        validate: 'ipv4',
    }
];
const privateLANDHCP = [
    {
        text: 'DHCP Range',
        value: 'Private_LAN__DHCP_DHCP_Range',
        validate: 'ipv4',
    },
    {
        text: 'DHCP Exclude',
        value: 'Private_LAN__DHCP_DHCP_Exclude_list',
        validate: 'ipv4',
    }
];
const privateLANStaticAllocation = [
    {
        text: 'Static Allocation MAC',
        value: 'Private_LAN__DHCP_Static_Allocation_MAC',
        validate: 'mac',
    },
    {
        text: 'Static Allocation IP',
        value: 'Private_LAN__DHCP_Static_Allocation_IP',
        validate: 'ipv4',
    }
];
const dns = [
    {
        text: 'DNS Primary',
        value: 'DNS_DNS_primary'
    },
    {
        text: 'DNS Secondary',
        value: 'DNS_DNS_secondary'
    }
];
const publicLAN = [
    {
        text: 'Subnet address',
        value: 'Public_LAN_Subnet_Address',
    },
    {
        text: 'Subnet mask',
        value: 'Public_LAN_Subnet_Mask',
    }
];

export const lanConfig = { privateLAN, privateLANDHCP, privateLANStaticAllocation, publicLAN, dns };

/* Voice LAN config */
const voiceLAN = [
    {
        text: 'Subnet Address',
        value: 'Voice_LAN_Subnet_Address',
        validate: 'ipv4',
    },
    {
        text: 'Subnet Mask',
        value: 'Voice_LAN_Subnet_Mask',
        validate: 'ipv4',
    },
    {
        text: 'Default Gateway',
        value: 'Voice_LAN_Subnet_Default_Gateway',
        validate: 'ipv4',
    }
];
const voiceLANDHCP = [
    {
        text: 'DHCP Range',
        value: 'Voice_LAN_Subnet__DHCP_DHCP_Range',
        validate: 'ipv4',
    },
    {
        text: 'DHCP Exclude',
        value: 'Voice_LAN_Subnet__DHCP_DHCP_Exclude_List',
        validate: 'ipv4',
    }
];
const voiceLANStaticAllocation = [
    {
        text: 'Static Allocation MAC',
        value: 'Voice_LAN_Subnet__DHCP_Static_Allocation_MAC',
        validate: 'mac',
    },
    {
        text: 'Static Allocation IP',
        value: 'Voice_LAN_Subnet__DHCP_Static_Allocation_IP',
        validate: 'ipv4',
    }
];

export const voiceConfig = { voiceLAN, voiceLANDHCP, voiceLANStaticAllocation };