// @ts-nocheck File not migrated fully to TS

import { ClusterServiceStatus } from '../../../app/components/shared/cluster/types';

export default function StatusIcon({ isFetching, status: { status, services } }) {
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
                    <ClusterStatusIcon status={ClusterServiceStatus[status]} />
                </div>
            }
        >
            <Popup.Content>
                <ClusterServicesOverview services={services} />
            </Popup.Content>
        </Popup>
    );
}

StatusIcon.propTypes = {
    status: PropTypes.shape({ status: PropTypes.string, services: PropTypes.shape({}) }),
    isFetching: PropTypes.bool
};

StatusIcon.defaultProps = {
    status: {},
    isFetching: false
};
