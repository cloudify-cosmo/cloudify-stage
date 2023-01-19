import React from 'react';
import type { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import { useSelector } from 'react-redux';

import Consts from '../../utils/consts';
import type { ReduxState } from '../../reducers';

const LinkToLogin: FunctionComponent = () => {
    const logoutRedirectUrl = useSelector((state: ReduxState) => state.config.app.auth.logoutRedirectUrl);
    const searchQuery = useSelector((state: ReduxState) => state.router.location.search);

    return logoutRedirectUrl.startsWith(Consts.CONTEXT_PATH) ? (
        <Link to={{ pathname: logoutRedirectUrl.replace(Consts.CONTEXT_PATH, ''), search: searchQuery }}>
            {i18n.t('backToLogin')}
        </Link>
    ) : (
        <a href={logoutRedirectUrl}>{i18n.t('backToLogin')}</a>
    );
};

export default LinkToLogin;
