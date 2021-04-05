// NOTE: necessary for Stage namespace to be registered
import '../utils/StageAPI';

declare global {
    // External libraries
    // @see https://docs.cloudify.co/developer/writing_widgets/widget-apis/#external-libraries
    export const PropTypes: typeof import('prop-types');
    export const moment: typeof import('moment');
    export const React: typeof import('react');
    export const ReactDOM: typeof import('react-dom');
    export const _: typeof import('lodash');
    export const L: typeof import('leaflet');
    export const log: typeof import('loglevel');
    export const connectToStore: typeof import('react-redux').connect;

    interface Window {
        PropTypes: typeof import('prop-types');
        moment: typeof import('moment');
        React: typeof import('react');
        ReactDOM: typeof import('react-dom');
        _: typeof import('lodash');
        L: typeof import('leaflet');
        log: typeof import('loglevel');
        connectToStore: typeof import('react-redux').connect;
    }

    export const process: {
        env: {
            NODE_ENV: 'production' | 'development';
            TEST: string;
            [key: string]: unknown;
        };
    };
}
