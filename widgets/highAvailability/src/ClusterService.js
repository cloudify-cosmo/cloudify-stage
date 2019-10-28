import { clusterServiceEnum, clusterServices, clusterServiceName } from './consts';

export default function ClusterService({ name, isExternal }) {
    const { Header, Icon, Label } = Stage.Basic;

    const icon = {
        [clusterServiceEnum.manager]: 'settings',
        [clusterServiceEnum.db]: 'database',
        [clusterServiceEnum.broker]: 'comments'
    }[name];

    return (
        <div style={{ verticalAlign: 'middle' }}>
            {isExternal && (
                <Label color="black" style={{ float: 'right' }}>
                    External
                </Label>
            )}
            <Header style={{ marginTop: 0 }}>
                <Icon name={icon} /> {clusterServiceName[name]}
            </Header>
        </div>
    );
}

ClusterService.propTypes = {
    name: PropTypes.oneOf(clusterServices).isRequired,
    isExternal: PropTypes.bool.isRequired
};
