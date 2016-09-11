/**
 * Created by kinneretzin on 11/09/2016.
 */

import {setValue} from '../actions/context';
export default class Context {
    static setValue(key,value) {
        setValue(key,value);
    }
}
