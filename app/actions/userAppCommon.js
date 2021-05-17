import _ from 'lodash';
import Consts from '../utils/consts';
import Internal from '../utils/Internal';

export function saveUserAppData() {
    return (dispatch, getState) => {
        const data = { appData: _.pick(getState(), 'pages'), version: Consts.APP_VERSION };

        const internal = new Internal(getState().manager);
        return internal.doPost('/ua', null, data);
    };
}
