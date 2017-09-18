'use strict';
/**
 * Created by edenp on 06/09/2017.
 */

import { connect } from 'react-redux';
import noTenants from '../components/NoTenants';

const mapStateToProps = (state, ownProps) => {
    return {
        portalUrl: state.config.app.saml.enabled ? state.config.app.saml.portalUrl : null
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(noTenants);
