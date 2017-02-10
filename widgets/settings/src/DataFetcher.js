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

        let cpes = cpes_data['products'].filter(
            product => { return product[product_type] === "CPE" }
        );

        let index = -1;
        let cpesOptions = cpes.map( cpe => {
            index++;
            return {
                text: cpe.branch,
                value: index
            }});

        let CPE = {
            cpes,
            cpesOptions
        };

        return Promise.resolve( {
            CPE
        });
    }
}