/**
 * Created by jakubniezgoda on 16/03/2017.
 */

export default class InfluxActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
        this.managerIp = toolbox.getManager().getIp();
    }

    doGetMetric(deploymentId, metric, from, to, timeGroup) {
        let params = _.isEmpty(from) && _.isEmpty(to) && _.isEmpty(timeGroup) ? null : {};
        if (from) {
            params.push({from});
        }
        if (to) {
            params.push({to});
        }
        if (timeGroup) {
            params.push({timeGroup});
        }

        return this.toolbox.getExternal().doGet(`/monitor/byMetric/${this.managerIp}/${deploymentId}/${metric}`, params);
    }

    doGetMetrics(deploymentId) {
        return this.toolbox.getExternal().doGet(`/monitor/metrics/${this.managerIp}/${deploymentId}`);
    }

    doRunQuery(query) {
        return this.toolbox.getExternal().doGet(`/monitor/query/${this.managerIp}`, {q: query});
    }
}