/**
 * Created by jakubniezgoda on 15/03/2019.
 */

import _ from 'lodash';
import { connect } from 'react-redux';

import { push } from 'connected-react-router';
import Consts from '../utils/consts';

import AboutModal from '../components/AboutModal';
import stageUtils from '../utils/stageUtils';

const mapStateToProps = state => {
    const manager = _.get(state, 'manager', {});

    return {
        canLicenseManagement:
            _.get(manager, 'license.isRequired', false) &&
            stageUtils.isUserAuthorized(Consts.permissions.LICENSE_UPLOAD, manager),
        version: _.get(manager, 'version', {}),
        license: _.get(manager, 'license.data', {})
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLicenseManagement: () => dispatch(push(Consts.LICENSE_PAGE_PATH))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AboutModal);
