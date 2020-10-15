/**
 * Created by edenp on 09/10/2017.
 */
import { connect } from 'react-redux';
import LinkToLogin from '../components/LinkToLogin';

const mapStateToProps = state => {
    return {
        portalUrl: state.config.app.saml.enabled ? state.config.app.saml.portalUrl : null,
        searchQuery: state.router.location.search
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LinkToLogin);
