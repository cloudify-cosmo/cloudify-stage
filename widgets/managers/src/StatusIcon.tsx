import type { ClusterServices, ClusterServiceStatus } from '../../../app/components/shared/cluster/types';

interface StatusIconProps {
    isFetching: boolean;
    status: {
        status: ClusterServiceStatus;
        services: ClusterServices;
    };
}

export default function StatusIcon({ isFetching = false, status: { status, services } }: StatusIconProps) {
    const { Icon, Popup } = Stage.Basic;
    const { ClusterStatusIcon, ClusterServicesOverview } = Stage.Shared;

    return isFetching ? (
        <Icon name="spinner" loading disabled />
    ) : (
        <Popup
            on="hover"
            wide
            trigger={
                <div>
                    <ClusterStatusIcon status={status} />
                </div>
            }
        >
            <Popup.Content>
                <ClusterServicesOverview services={services} />
            </Popup.Content>
        </Popup>
    );
}
