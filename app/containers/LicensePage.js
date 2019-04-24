/**
 * Created by jakub.niezgoda on 07/03/2019.
 */

import { connect } from 'react-redux';
import LicensePage from '../components/LicensePage';
import {setLicense} from '../actions/license';
import {push} from 'connected-react-router';
import Consts from '../utils/consts';
import Auth from '../utils/auth';
import stageUtils from '../utils/stageUtils';

const mapStateToProps = (state, ownProps) => {
    const manager = _.get(state, 'manager', {});
    const license = _.get(manager, 'license', {});

    return {
        canUploadLicense: stageUtils.isUserAuthorized(Consts.permissions.LICENSE_UPLOAD, manager),
        isProductOperational:  Auth.isProductOperational(license),
        license: _.get(license, 'data', {}),
        status: _.get(license, 'status', Consts.LICENSE.EMPTY)
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onLicenseUpload: (license) => {
            dispatch(setLicense(license));
        },
        onGoToApp: () => {
            dispatch(push(Consts.HOME_PAGE_PATH));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LicensePage);
