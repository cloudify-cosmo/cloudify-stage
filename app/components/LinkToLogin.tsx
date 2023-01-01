import type { FunctionComponent } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import { connect } from 'react-redux';
import Consts from '../utils/consts';
import type { ReduxState } from '../reducers';

interface LinkToLoginProps {
    portalUrl?: string;
    searchQuery?: string;
}
const LinkToLogin: FunctionComponent<LinkToLoginProps> = ({ portalUrl, searchQuery }) =>
    portalUrl ? (
        <a href={portalUrl}>{i18n.t('backToApps', 'Back to apps')}</a>
    ) : (
        <Link to={{ pathname: Consts.PAGE_PATH.LOGIN, search: searchQuery }}>
            {i18n.t('backToLogin', 'Back to login')}
        </Link>
    );

const mapStateToProps = (state: ReduxState) => {
    return {
        portalUrl: state.config.app.saml.enabled ? state.config.app.saml.portalUrl : undefined,
        searchQuery: state.router.location.search
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LinkToLogin);
