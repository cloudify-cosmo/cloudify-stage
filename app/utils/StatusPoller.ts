import { get } from 'lodash';
import log from 'loglevel';
import { getMaintenanceStatus } from '../actions/manager/maintenance';
import { getClusterStatus } from '../actions/manager/clusterStatus';
import StageUtils from './stageUtils';
import type { ReduxStore } from '../configureStore';
import type { CancelablePromise } from './types';

type StatusPollerSingleton = StatusPoller;
let singleton: StatusPollerSingleton;

export default class StatusPoller {
    pollerTimer?: NodeJS.Timeout;

    fetchMaintenanceStatusPromise?: CancelablePromise<void>;

    fetchClusterStatusPromise?: CancelablePromise<void>;

    isActive: boolean;

    interval: number;

    constructor(private store: ReduxStore) {
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
        if (this.pollerTimer) {
            clearTimeout(this.pollerTimer);
        }

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

    static create(store: ReduxStore) {
        singleton = new StatusPoller(store);
    }

    static getPoller() {
        return singleton;
    }
}
