/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux';
import Manager from '../components/Manager';
import stageUtils from '../utils/stageUtils';
import Consts from '../utils/consts';
import { getClusterStatus } from '../actions/clusterStatus';

const mapStateToProps = state => {
    return {
        showServicesStatus: stageUtils.isUserAuthorized(Consts.permissions.STAGE_SERVICES_STATUS, state.manager)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onServicesStatusOpen: () => {
            dispatch(getClusterStatus());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Manager);
