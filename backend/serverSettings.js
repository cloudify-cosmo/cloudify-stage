'use strict';
/**
 * Created by kinneretzin on 25/01/2017.
 */

var logger = require('log4js').getLogger('argsReader');


var ServerSettings = {

    MODE_MAIN: 'main',
    MODE_CUSTOMER : 'customer',

    settings: {},

    init: function(){
        this.settings = {
            mode: this.MODE_MAIN
        };

        var displayUsage = ()=>{
            logger.info('Usage: server.js -mode ['+MODE_MAIN + '|' +MODE_CUSTOMER + ']');
            process.exit(0);
        };

        process.argv.forEach((val, index) => {
            if (val.toLowerCase() === '-h') {
                displayUsage();
            }

            if (val.toLowerCase() === '-mode') {
                if (process.argv.length > index+1){
                    var mode = process.argv[index+1].toLowerCase();
                    if (mode === this.MODE_MAIN || mode === this.MODE_CUSTOMER) {
                        this.settings.mode = mode;
                    } else {
                        displayUsage();
                    }
                } else {
                    displayUsage();
                }
            }
        });

    }
};

module.exports = ServerSettings;