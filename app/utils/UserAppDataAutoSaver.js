/**
 * Created by kinneretzin on 09/02/2017.
 */

import {saveUserAppData} from '../actions/userApp'

import StageUtils from './stageUtils';


var singleton = null;

export default class UserAppDataAutoSaver {
    constructor (store) {
        this._store = store;
        this._isActive = false;

        this._initFromStore();

        // Subscribe to store change
        this.unsubscribe = store.subscribe(() => {
            var state = this._store.getState();

            if (this._isActive && this._hasDataChanged(state) && this._validData(state)) {
                this._initFromStore();

                this._store.dispatch(saveUserAppData(this._ip,this._username,this._role,{pages: this._pages}));
            }
        });
    }

    _initFromStore() {
        var state = this._store.getState();
        this._pages = state.pages;
        this._ip = _.get(state,'manager.ip');
        this._username = _.get(state,'manager.username');
        this._role = _.get(state,'manager.auth.role');
    }

    _validData (state) {
        return (_.get(state,'manager.ip') && _.get(state,'manager.username') && _.get(state,'manager.auth.role'));
    }

    _hasDataChanged(state) {
        return (this._ip !== state.manager.ip ||
            this._username !== state.manager.username ||
            this._role !== state.manager.auth.role ||
            !_.isEqual(this._pages,state.pages) )
    }

    start() {
        if (!this._isActive) {
            console.log(`Starting UserAppDataAutoSaver for for manager ${this._ip} user ${this._username} role ${this._role}`);
            this._isActive = true;
        }
    }

    stop() {
        if (this._isActive) {
            console.log(`Stopping UserAppDataAutoSaver for for manager ${this._ip} user ${this._username} role ${this._role}`);

            this._isActive = false;
        }
    }

    static create(store){
        singleton = new UserAppDataAutoSaver(store);
    }
    static getAutoSaver() {
        return singleton;
    }
}
