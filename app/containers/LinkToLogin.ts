// @ts-nocheck File not migrated fully to TS
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
