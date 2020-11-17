/**
 * Created by edenp on 09/10/2017.
 */
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import Consts from '../utils/consts';

export default function LinkToLogin({ portalUrl, searchQuery }) {
    return portalUrl ? (
        <a href={portalUrl}>{i18n.t('backToApps', 'Back to apps')}</a>
    ) : (
        <Link to={{ pathname: Consts.LOGIN_PAGE_PATH, search: searchQuery }}>
            {i18n.t('backToLogin', 'Back to login')}
        </Link>
    );
}

LinkToLogin.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    portalUrl: PropTypes.string
};

LinkToLogin.defaultProps = {
    portalUrl: null
};
