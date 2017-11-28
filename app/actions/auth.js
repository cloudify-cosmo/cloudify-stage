/**
 * Created by edenp on 08/11/2017.
 */

import {push} from 'react-router-redux';
import {clearContext} from './context';
import {setAppError} from './app';

export function unauthorized(err) {
    return function (dispatch) {
        dispatch(clearContext());
        dispatch(setAppError(err));
        dispatch(push('/error'));
    }
}
