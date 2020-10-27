/**
 * Created by jakubniezgoda on 18/04/2018.
 */

import _ from 'lodash';
import { connect } from 'react-redux';
import Routes from '../components/Routes';

import Consts from '../utils/consts';
import Auth from '../utils/auth';

const mapStateToProps = state => {
    return {
        isProductOperational: Auth.isProductOperational(_.get(state, 'manager.license', {})),
        isLicenseRequired: _.get(state, 'manager.license.isRequired', false),
        isLoggedIn: Auth.isLoggedIn(),
        isInMaintenanceMode: state.manager && state.manager.maintenance === Consts.MAINTENANCE_ACTIVATED,
        isSamlEnabled: _.get(state, 'config.app.saml.enabled', false),
        samlPortalUrl: _.get(state, 'config.app.saml.portalUrl', ''),
        samlSsoUrl: _.get(state, 'config.app.saml.ssoUrl', '')
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
