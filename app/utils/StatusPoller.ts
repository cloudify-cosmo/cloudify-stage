// @ts-nocheck File not migrated fully to TS

import { get } from 'lodash';
import log from 'loglevel';
import { getMaintenanceStatus } from '../actions/manager/maintenance';
import { getClusterStatus } from '../actions/manager/clusterStatus';
import StageUtils from './stageUtils';

let singleton = null;

export default class StatusPoller {
    constructor(store) {
        this.store = store;
        this.pollerTimer = null;
        this.fetchMaintenanceStatusPromise = null;
        this.fetchClusterStatusPromise = null;
        this.isActive = false;
        this.interval = store.getState().config.app.maintenancePollingInterval;
    }

    getManagerIp() {
        return get(this.store.getState(), 'config.manager.ip');
    }

    start() {
        if (!this.isActive) {
            log.log(`Starting status polling for manager ${this.getManagerIp()}`);

            this.isActive = true;

            // Do the first fetch
            this.fetchStatus().then(this.startPolling.bind(this));
            // this.startPolling();
        }
    }

    stop() {
        if (this.isActive) {
            log.log(`Stopping status polling for manager ${this.getManagerIp()}`);

            this.isActive = false;
            this.stopPolling();
        }
    }

    stopPolling() {
        clearTimeout(this.pollerTimer);

        if (this.fetchMaintenanceStatusPromise) {
            this.fetchMaintenanceStatusPromise.cancel();
        }
        if (this.fetchClusterStatusPromise) {
            this.fetchClusterStatusPromise.cancel();
        }
    }

    startPolling() {
        this.stopPolling();

        log.log(`Polling status for manager ${this.getManagerIp()} - time interval: ${this.interval} sec`);
        this.pollerTimer = setTimeout(() => {
            this.fetchStatus().then(this.startPolling.bind(this));
        }, this.interval);
    }

    fetchStatus() {
        const fetchMaintenanceStatus = this.store.dispatch(getMaintenanceStatus(this.store.getState().manager));
        this.fetchMaintenanceStatusPromise = StageUtils.makeCancelable(fetchMaintenanceStatus);
        const fetchClusterStatus = this.store.dispatch(getClusterStatus(true));
        this.fetchClusterStatusPromise = StageUtils.makeCancelable(fetchClusterStatus);

        return Promise.all([this.fetchMaintenanceStatusPromise.promise, this.fetchClusterStatusPromise.promise]);
    }

    static create(store) {
        singleton = new StatusPoller(store);
    }

    static getPoller() {
        return singleton;
    }
}
