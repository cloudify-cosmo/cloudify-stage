import Internal from '../utils/Internal';

export const CURRENT_APP_DATA_VERSION = 4;

export function saveUserAppData() {
    return (dispatch, getState) => {
        const data = { appData: _.pick(getState(), 'pages'), version: CURRENT_APP_DATA_VERSION };

        const internal = new Internal(getState().manager);
        return internal.doPost('/ua', null, data);
    };
}
