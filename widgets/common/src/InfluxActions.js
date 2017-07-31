/**
 * Created by jakubniezgoda on 16/03/2017.
 */

class InfluxActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetMetric(deploymentId, metric, from, to, timeGroup) {
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

        return this.toolbox.getInternal().doGet(`/monitor/byMetric/${deploymentId}/${metric}`, params);
    }

    doGetMetrics(deploymentId) {
        return this.toolbox.getInternal().doGet(`/monitor/metrics/${deploymentId}`);
    }

    doRunQuery(query) {
        return this.toolbox.getInternal().doGet('/monitor/query', {q: query});
    }
}

Stage.defineCommon({
    name: 'InfluxActions',
    common: InfluxActions
});