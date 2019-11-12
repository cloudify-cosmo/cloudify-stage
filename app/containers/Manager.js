/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux';
import Manager from '../components/Manager';
import stageUtils from '../utils/stageUtils';
import Consts from '../utils/consts';
import { getStatus } from '../actions/status';

const mapStateToProps = state => {
    return {
        showServicesStatus: stageUtils.isUserAuthorized(Consts.permissions.STAGE_SERVICES_STATUS, state.manager)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onServicesStatusOpen: () => {
            dispatch(getStatus());
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Manager);
