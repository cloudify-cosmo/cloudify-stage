/**
 * Created by edenp on 17/12/2017.
 */

import { connect } from 'react-redux';
import ResourceAvailability from '../components/basic/ResourceAvailability';
import stageUtils from '../utils/stageUtils';
import consts from '../utils/consts';

const mapStateToProps = (state, ownProps) => {
    var allowedSettingTo = ownProps.allowedSettingTo;
    if(_.includes(ownProps.allowedSettingTo, consts.availability.GLOBAL) && !stageUtils.isUserAuthorized(consts.permissions.CREATE_GLOBAL_RESOURCE, state.manager)){
        allowedSettingTo = _.without(allowedSettingTo, consts.availability.GLOBAL);
    }
    return {
        allowedSettingTo: allowedSettingTo
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ResourceAvailability);