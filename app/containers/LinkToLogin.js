/**
 * Created by edenp on 09/10/2017.
 */
import { connect } from 'react-redux';
import LinkToLogin from '../components/LinkToLogin';

const mapStateToProps = (state, ownProps) => {
    return {
        portalUrl: state.config.app.saml.enabled ? state.config.app.saml.portalUrl : null,
        searchQuery: state.routing.locationBeforeTransitions.search
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LinkToLogin);

