// @ts-nocheck File not migrated fully to TS

import _ from 'lodash';
import { connect } from 'react-redux';
import Routes from '../components/Routes';

import Auth from '../utils/auth';

const mapStateToProps = state => {
    return {
        isLoggedIn: Auth.isLoggedIn(),
        isSamlEnabled: _.get(state, 'config.app.saml.enabled', false),
        samlPortalUrl: _.get(state, 'config.app.saml.portalUrl', ''),
        theme: _.get(state, 'config.app.whiteLabel', {})
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
