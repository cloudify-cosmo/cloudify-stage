import type { DrilldownHandler } from 'cloudify-ui-components/toolbox';
import type Manager from 'app/utils/Manager';

export type Agent = {
    id: string;
    ip: string;
    deployment: string;
    node: string;
    system: string;
    version: string;
    // eslint-disable-next-line camelcase
    install_method: InstallMethod;
    // eslint-disable-next-line camelcase
    host_id: string;
};

export type InstallMethod = 'remote' | 'plugin' | 'init_script' | 'provided';

export type ResourceId = string | string[];

export type ResourceIds = {
    blueprintId?: ResourceId;
    deploymentId?: ResourceId;
    nodeId?: ResourceId;
    nodeInstanceId?: ResourceId;
};

export interface AgentsModalProps extends ResourceIds {
    open: boolean;
    onHide: () => void;
    agents: Agent[];
    installMethods: InstallMethod[];
    drilldownHandler: DrilldownHandler;
    manager: Manager;
}
