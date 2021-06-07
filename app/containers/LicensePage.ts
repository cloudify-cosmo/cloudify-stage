/**
 * Created by jakub.niezgoda on 07/03/2019.
 */

import _ from 'lodash';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Manager from '../utils/Manager';
import LicensePage from '../components/LicensePage';
import { setLicense } from '../actions/license';
import Consts from '../utils/consts';
import Auth from '../utils/auth';
import stageUtils from '../utils/stageUtils';

const mapStateToProps = state => {
    const manager = _.get(state, 'manager', {});
    const license = _.get(manager, 'license', {});
    const managerAccessor = new Manager(manager);

    return {
        canUploadLicense: stageUtils.isUserAuthorized(Consts.permissions.LICENSE_UPLOAD, manager),
        isProductOperational: Auth.isProductOperational(license),
        license: _.get(license, 'data', {}),
        status: _.get(license, 'status', Consts.LICENSE.EMPTY),
        manager: managerAccessor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLicenseChange: license => {
            dispatch(setLicense(license));
        },
        onGoToApp: () => {
            dispatch(push(Consts.HOME_PAGE_PATH));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LicensePage);
