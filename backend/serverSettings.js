'use strict';
/**
 * Created by kinneretzin on 25/01/2017.
 */

var logger = require('log4js').getLogger('argsReader');
var _ = require('lodash');

var ServerSettings = {

    MODE_MAIN: 'main',
    MODE_CUSTOMER : 'customer',
    MODE_COMMUNITY : 'community',

    settings: {},

    init: function(){
        this.settings = {
            mode: this.MODE_MAIN
        };
        var modes = [this.MODE_MAIN, this.MODE_CUSTOMER, this.MODE_COMMUNITY];

        var displayUsage = ()=>{
            logger.info('Usage: server.js -mode [' + _.join(modes,'|') + ']');
            process.exit(0);
        };

        process.argv.forEach((val, index) => {
            if (val.toLowerCase() === '-h') {
                displayUsage();
            }

            if (val.toLowerCase() === '-mode') {
                if (process.argv.length > index+1){
                    var mode = process.argv[index+1].toLowerCase();
                    if (_.includes(modes, mode)) {
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