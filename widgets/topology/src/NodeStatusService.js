import { consts, icons } from 'cloudify-ui-common';

const states = [
    'uninitialized',
    'initializing',
    'creating',
    'created',
    'configuring',
    'configured',
    'starting',
    'started',
    'deleting',
    'deleted',
    'stopping',
    'stopped'
];

const NODE_STATUS = consts.nodeStatuses;

function stateToNum(instance) {
    return _.indexOf(states, typeof instance === 'string' ? instance : instance.state);
}

export default class NodeStatusService {
    static getNodeStatuses() {
        // for tests
        return NODE_STATUS;
    }

    static isStarted(instance) {
        return instance && instance.state === 'started';
    }

    static isCompleted(instance) {
        return NodeStatusService.isStarted(instance);
    }

    static isInProgress(instance) {
        // todo: consider using !uninitialized.. single source of truth
        const stateNum = stateToNum(instance);
        return stateNum > 0 && stateNum <= 7;
    }

    static isUninitialized(instance) {
        const stateNum = stateToNum(instance);
        return stateNum === 0 || stateNum > 7; // ignore stopped and deleted states
    }

    /**
     *
     * @param {NODE_STATUS} nodeStatus
     */
    static getContentByStatus(nodeStatus) {
        return icons.getNodeStatusIcon(nodeStatus);
    }

    static getColorByStatus(nodeStatus) {
        switch (nodeStatus) {
            case NODE_STATUS.DONE:
                return '#8eaf26';
            case NODE_STATUS.LOADING:
                return '#2f3334';
            case NODE_STATUS.ALERT:
                return '#feb300';
            case NODE_STATUS.FAILED:
                return '#d54931';
            case NODE_STATUS.UNINITIALIZED:
                return 'white';
        }
    }

    static getInstancesCountPerState(instances) {
        return _.countBy(instances, 'state');
    }

    // an aggregation of all instances
    static getNodeState(inProgress, instances) {
        let status = inProgress ? NODE_STATUS.LOADING : NODE_STATUS.UNINITIALIZED;

        // if node is not completed when execution is over, the execution is failed. we ignore uninitialized scenario here.
        const failed = _.find(instances, function(instance) {
            return !NodeStatusService.isCompleted(instance);
        });
        const completed = _.find(instances, function(instance) {
            return NodeStatusService.isCompleted(instance);
        });

        const initialized = _.find(instances, function(instance) {
            return !NodeStatusService.isUninitialized(instance);
        });

        if (initialized) {
            // did someone even try to install the blueprint?? - if not, there's nothing to talk about
            if (!inProgress) {
                if (!completed) {
                    // not even one node is completed. this is a total failure!!!
                    status = NODE_STATUS.FAILED;
                } else if (failed) {
                    // some are completed. some are failed.. minor failure
                    status = NODE_STATUS.ALERT;
                }
            } // else in progress, then status is loading. since it is already set.. we do nothing here..

            // no regardless if in progress or not, if everything is ok, show success
            if (completed && !failed) {
                // if all nodes completed and nothing failed, then everything is working. yey!!!!
                status = NODE_STATUS.DONE;
            }
        }

        return status;
    }
}
