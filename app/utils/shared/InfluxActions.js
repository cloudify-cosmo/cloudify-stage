/**
 * Created by jakubniezgoda on 16/03/2017.
 */

export default class InfluxActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetMetric(deploymentId, nodeId, nodeInstanceId, metrics, from, to, timeGroup) {
        let params = {};
        if (!_.isEmpty(from)) {
            params.from = from;
        }
        if (!_.isEmpty(to)) {
            params.to = to;
        }
        if (!_.isEmpty(timeGroup)) {
            params.timeGroup = timeGroup;
        }

        return this.toolbox.getInternal().doGet(`/monitor/byMetric/${deploymentId || '*'}/${nodeId || '*'}/${nodeInstanceId || '*'}/${metrics || '*'}`, params);
    }


    doGetMetrics(deploymentId, nodeId, nodeInstanceId) {
        return this.toolbox.getInternal().doGet(`/monitor/metrics/${deploymentId || '*'}/${nodeId || '*'}/${nodeInstanceId || '*'}`);
    }

    doRunQuery(qSelect, qFrom, qWhere) {
        return this.toolbox.getInternal().doGet('/monitor/query', {qSelect, qFrom, qWhere});
    }
}
