/**
 * Created by jakubniezgoda on 15/03/2019.
 */

import { connect } from 'react-redux'

import { push } from 'connected-react-router';
import Consts from '../utils/consts';

import AboutModal from '../components/AboutModal'
import stageUtils from '../utils/stageUtils';

const mapStateToProps = (state, ownProps) => {
    const manager = _.get(state, 'manager', {});

    return {
        canLicenseManagement: stageUtils.isUserAuthorized(Consts.permissions.LICENSE_UPLOAD, manager),
        version: _.get(manager, 'version', {}),
        license: _.get(manager, 'license.data', {})
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onLicenseManagment: () => dispatch(push(Consts.LICENSE_PAGE_PATH))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AboutModal);
