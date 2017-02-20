/**
 * Created by pposel on 16/02/2017.
 */

import Manager from '../../utils/Manager';

export default class {

    constructor(manager) {
        this.managerAccessor = new Manager(manager);
    }

    doGetActiveExecutions() {
        return this.managerAccessor.doGet('/executions?_include=id,workflow_id,status,deployment_id',
                                          {status: ['pending', 'started', 'cancelling', 'force_cancelling']});
    }

    doActivateMaintenance() {
        return this.managerAccessor.doPost('/maintenance/activate');
    }

    doDeactivateMaintenance() {
        return this.managerAccessor.doPost('/maintenance/deactivate');
    }

    doCancelExecution(execution, action) {
        return this.managerAccessor.doPost(`/executions/${execution.id}`, null,
                                           {deployment_id: execution.deployment_id, action});
    }

}