import _ from 'lodash';
import { connect } from 'react-redux';
import Routes from '../components/Routes';
import type { ReduxState } from '../reducers';

const mapStateToProps = (state: ReduxState) => {
    return {
        isLoggedIn: state.manager.auth.state === 'loggedIn',
        isSamlEnabled: _.get(state, 'config.app.saml.enabled', false),
        samlPortalUrl: _.get(state, 'config.app.saml.portalUrl', ''),
        theme: _.get(state, 'config.app.whiteLabel', {})
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
