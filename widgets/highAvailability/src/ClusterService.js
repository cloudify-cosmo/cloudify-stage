import { clusterServiceEnum, clusterServices, clusterServiceName } from './consts';

export default function ClusterService({ name, isExternal }) {
    const { Icon, Header, Popup } = Stage.Basic;

    const icon = {
        [clusterServiceEnum.manager]: 'settings',
        [clusterServiceEnum.db]: 'database',
        [clusterServiceEnum.broker]: 'comments'
    }[name];

    return (
        <div style={{ verticalAlign: 'middle' }}>
            {isExternal && (
                <Popup trigger={<Icon name="external" style={{ float: 'right' }} />} content="External Service" />
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
