/**
 * Created by jakub on 2/10/17.
 */

export default class DataFetcher{
    static fetch(toolbox, customer_id) {

        /*
            Get all dynamic data -> GET verb to uri csp/customer/getAllForCustomer
            Get all CPEs -> GET verb to uri /ui/product/CPE/xxx (no format yet 10.02.17)
         */
        let cpes_data = require('./Data/cpe.json');
        const product_type = "product_type";

        let CPEs = cpes_data['products'].filter(
            product => { return product[product_type] === "CPE" }
        );

        let index = -1;
        let options = CPEs.map( cpe => {
            index++;
            return {
                text: cpe.branch,
                value: index
            }});

        let CPE = {
            CPEs,
            options
        };


        /*
               SDWAN
         */
        let applications = require('./Data/sdwan_applications.json').applications;
        let interfaces = require('./Data/sdwan_interfaces.json').interfaces;

        let applicationsSelectedItems = [[],[]];
        let interfacesSelectedItems = [[],[]];

        let status = '1';
        let applicationsVisible = false;

        let SDWAN =  {
            applications,
            interfaces,
            applicationsSelectedItems,
            interfacesSelectedItems,
            status,
            applicationsVisible
        };

        return Promise.resolve( {
            CPE,
            SDWAN
        });
    }
}