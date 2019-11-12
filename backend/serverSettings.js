/**
 * Created by kinneretzin on 25/01/2017.
 */

const _ = require('lodash');
const logger = require('./handler/LoggerHandler').getLogger('argsReader');

const ServerSettings = {
    MODE_MAIN: 'main',
    MODE_CUSTOMER: 'customer',
    MODE_COMMUNITY: 'community',

    settings: {},

    init() {
        this.settings = {
            mode: this.MODE_MAIN
        };
        const modes = [this.MODE_MAIN, this.MODE_CUSTOMER, this.MODE_COMMUNITY];

        const displayUsage = () => {
            logger.info(`Usage: server.js -mode [${_.join(modes, '|')}]`);
            process.exit(0);
        };

        process.argv.forEach((val, index) => {
            if (val.toLowerCase() === '-h') {
                displayUsage();
            }

            if (val.toLowerCase() === '-mode') {
                if (process.argv.length > index + 1) {
                    const mode = process.argv[index + 1].toLowerCase();
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
