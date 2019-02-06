/**
 * Created by kinneretzin on 09/02/2017.
 */

import {getMaintenanceStatus} from '../actions/managers';
import StageUtils from './stageUtils';


var singleton = null;

export default class StatusPoller {
    constructor (store) {
        this._store = store;
        this._pollerTimer = null;
        this._fetchStatusPromise = null;
        this._isActive = false;
        this.interval = store.getState().config.app.maintenancePollingInterval;
    }

    getManagerIp() {
        return _.get(this._store.getState(), 'config.manager.ip');
    }

    start() {
        if (!this._isActive) {
            console.log(`Starting status polling for manager ${this.getManagerIp()}`);

            this._isActive = true;

            // Do the first fetch
            this._fetchStatus().then(this._start.bind(this));
            //this._start();
        }
    }

    stop() {
        if (this._isActive) {
            console.log(`Stopping status polling for manager ${this.getManagerIp()}`);

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

        console.log(`Polling status for manager ${this.getManagerIp()} - time interval: ${this.interval} sec`);
        this._pollerTimer = setTimeout(()=>{this._fetchStatus().then(this._start.bind(this))}, this.interval);
    }


    _fetchStatus () {
        var fetchStatus = this._store.dispatch(getMaintenanceStatus(this._store.getState().manager));
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
