import React from 'react';
import type { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import { useSelector } from 'react-redux';

import Consts from '../../utils/consts';
import type { ReduxState } from '../../reducers';

const LinkToLogin: FunctionComponent = () => {
    const portalUrl = useSelector((state: ReduxState) => state.config.app.auth.portalUrl);
    const searchQuery = useSelector((state: ReduxState) => state.router.location.search);

    return portalUrl.startsWith(Consts.CONTEXT_PATH) ? (
        <Link to={{ pathname: portalUrl.replace(Consts.CONTEXT_PATH, ''), search: searchQuery }}>
            {i18n.t('backToLogin')}
        </Link>
    ) : (
        <a href={portalUrl}>{i18n.t('backToLogin')}</a>
    );
};

export default LinkToLogin;
