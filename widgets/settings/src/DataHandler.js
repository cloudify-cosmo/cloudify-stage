/**
 * Created by jakub on 2/6/17.
 */

let fetchCPEData = function() {
    let fetch = require('./Data/cpe.json');
    let cpesOptions = Object.values(fetch).map( cpe => ({ text: cpe.site, value: cpe.value }) );

    return {
        fetch,
        cpesOptions
    };
};

let fetchSDWANData = function() {
    let applications = require('./Data/sdwan_applications.json').applications;
    let interfaces = require('./Data/sdwan_interfaces.json').interfaces;

    let applicationsSelectedItems = [[],[]];
    let interfacesSelectedItems = [[],[]];

    return {
        applications,
        interfaces,
        applicationsSelectedItems,
        interfacesSelectedItems
    };
};

let fetchVASData = function() {

};

let fetchSSLVPNData = function() {

};

let fetchACLData = function() {

};

export default function fetchData() {
    return {
        CPE: fetchCPEData(),
        SD_WAN: fetchSDWANData(),
        VAS: fetchVASData(),
        SSL_VPN: fetchSSLVPNData(),
        ACL: fetchACLData()
    }
}