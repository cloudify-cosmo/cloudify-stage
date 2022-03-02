/* eslint-disable no-console, no-process-exit */

import _ from 'lodash';

export const MODE_MAIN = 'main' as const;
export const MODE_CUSTOMER = 'customer' as const;
export const MODE_COMMUNITY = 'community' as const;
export type Mode = typeof MODE_MAIN | typeof MODE_CUSTOMER | typeof MODE_COMMUNITY;

let serverMode: Mode;

export function setMode(mode: Mode) {
    serverMode = mode;
}

export function getMode(): Mode {
    return serverMode;
}

export function init() {
    serverMode = MODE_MAIN;
    const modes = [MODE_MAIN, MODE_CUSTOMER, MODE_COMMUNITY];

    const displayUsage = () => {
        console.log(`Usage: server.js -mode [${_.join(modes, '|')}]`);
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
                    serverMode = <Mode>mode;
                } else {
                    displayUsage();
                }
            } else {
                displayUsage();
            }
        }
    });
}
