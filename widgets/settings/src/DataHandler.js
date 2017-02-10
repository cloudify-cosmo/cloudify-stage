/**
 * Created by jakub on 2/6/17.
 */

const LAN_Configuration_Prefix = "LAN_Configuration_";
const Voice_LAN_Configuration_Prefix = "Voice_LAN_Configuration_";
const product_type = "product_type";

let fetchAll = function() {
    let fetch = require('./Data/cpe.json');
    return fetch;
};

let getCPEs = function () {
    let fetch = fetchAll();

    let cpes = fetch['products'].filter(
        product => { return product[product_type] === "CPE" }
    );

    return cpes;
};


let fetchCPEData = function() {
    let cpes = getCPEs();

    let index = -1;
    let cpesOptions = cpes.map( cpe => {
        index++;
        return {
            text: cpe.branch,
            value: index
        }});

    return {
        cpes,
        cpesOptions
    };
};

let fetchSDWANData = function() {
    let applications = require('./Data/sdwan_applications.json').applications;
    let interfaces = require('./Data/sdwan_interfaces.json').interfaces;

    let applicationsSelectedItems = [[],[]];
    let interfacesSelectedItems = [[],[]];

    let status = '1';
    let applicationsVisible = false;

    return {
        applications,
        interfaces,
        applicationsSelectedItems,
        interfacesSelectedItems,
        status,
        applicationsVisible
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