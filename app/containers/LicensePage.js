/**
 * Created by jakub.niezgoda on 07/03/2019.
 */

import { connect } from 'react-redux';
import LicensePage from '../components/LicensePage';
import {setLicense} from '../actions/license';
import {push} from 'connected-react-router';
import Consts from '../utils/consts';
import Auth from '../utils/auth';

const mapStateToProps = (state, ownProps) => {
    const license = _.get(state, 'manager.license', {});

    return {
        manager: state.manager,
        isProductOperational:  Auth.isProductOperational(license),
        license: _.get(license, 'data', {}),
        status: _.get(license, 'status', Consts.LICENSE.EMPTY)
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onLicenseUpload: (key) => {
            dispatch(setLicense(key));
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
