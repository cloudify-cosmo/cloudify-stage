import { ClusterServiceStatus } from 'app/components/misc/status/cluster/types';

export const styles = {
    [ClusterServiceStatus.Degraded]: 'background-color: rgb(251, 189, 8);',
    [ClusterServiceStatus.OK]: 'background-color: rgb(33, 186, 69);',
    [ClusterServiceStatus.Fail]: 'background-color: rgb(219, 40, 40);',
    [ClusterServiceStatus.Unknown]: 'background-color: rgb(170, 170, 170);'
};
