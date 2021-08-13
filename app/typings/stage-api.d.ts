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
    export const log: typeof import('loglevel');
    export const connectToStore: typeof import('react-redux').connect;
    export const ReactRedux: Pick<typeof import('react-redux'), 'useSelector' | 'useDispatch'>;
    export const ReactRouter: Pick<typeof import('connected-react-router'), 'replace'>;
    export const ReactQuery: typeof import('react-query');

    interface Window {
        PropTypes: typeof PropTypes;
        moment: typeof moment;
        React: typeof React;
        ReactDOM: typeof ReactDOM;
        _: typeof _;
        log: typeof log;
        connectToStore: typeof connectToStore;
        ReactRedux: typeof ReactRedux;
        ReactRouter: typeof ReactRouter;
        ReactQuery: typeof ReactQuery;
    }

    export const process: {
        env: {
            NODE_ENV: 'production' | 'development';
            TEST: string;
            [key: string]: unknown;
        };
    };
}
