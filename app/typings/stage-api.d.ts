import type { StageAPI } from '../utils/StageAPI';

declare global {
    export const Stage: StageAPI;

    // External libraries
    // @see https://docs.cloudify.co/developer/writing_widgets/widget-apis/#external-libraries
    export const PropTypes: typeof import('prop-types');
    export const moment: typeof import('moment');
    export const React: typeof import('react');
    export const _: typeof import('lodash');

    interface Window {
        Stage: StageAPI;
        PropTypes: typeof import('prop-types');
        moment: typeof import('moment');
        React: typeof import('react');
        _: typeof import('lodash');
    }
}
