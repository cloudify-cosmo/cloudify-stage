/**
 * Created by edenp on 08/11/2017.
 */

import { push } from 'connected-react-router';
import { clearContext } from './context';
import { setAppError } from './appState';
import Consts from '../utils/consts';

export function showAppError(err) {
    return dispatch => {
        dispatch(clearContext());
        dispatch(setAppError(err));
        dispatch(push(Consts.ERROR_PAGE_PATH));
    };
}

export default showAppError;
