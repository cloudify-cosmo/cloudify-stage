/**
 * Created by kinneretzin on 09/02/2017.
 */

import {getStatus,logout} from '../actions/managers';
import StageUtils from './stageUtils';


var singleton = null;

const interval = 10000;

export default class StatusPoller {
    constructor (store) {
        this._store = store;
        this._pollerTimer = null;
        this._fetchStatusPromise = null;
        this._isActive = false;
    }

    start() {
        if (!this._isActive) {
            console.log(`Starting status polling for for manager ${this._store.getState().manager.ip}`);

            this._isActive = true;

            // Do the first fetch
            this._fetchStatus().then(this._start.bind(this));
            //this._start();
        }
    }

    stop() {
        if (this._isActive) {
            console.log(`Stopping status polling for for manager ${this._store.getState().manager.ip}`);

            this._isActive = false;
            this._stop();
        }
    }

    _stop() {
        clearTimeout(this._pollerTimer);

        if (this._fetchStatusPromise) {
            this._fetchStatusPromise.cancel();
        }
    }
    _start() {
        this._stop();

        if (this._store.getState().manager.badStatusCount >= 2) {
            console.log('Noticed that get too many bad status responses from server, logging out');
            this._store.dispatch(logout('Server seems to be unavailable, try again later'));
        } else {
            console.log(`Polling manager status for manager ${this._store.getState().manager.ip} - time interval: ${interval} sec`);
            this._pollerTimer = setTimeout(()=>{this._fetchStatus().then(this._start.bind(this))}, interval);
        }
    }


    _fetchStatus () {
        var fetchStatus = this._store.dispatch(getStatus(this._store.getState().manager));
        this._fetchStatusPromise = StageUtils.makeCancelable(fetchStatus);

        return this._fetchStatusPromise.promise;
    }

    static create(store){
        singleton = new StatusPoller(store);
    }
    static getPoller() {
        return singleton;
    }
}
