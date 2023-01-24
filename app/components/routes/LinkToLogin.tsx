import React from 'react';
import type { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import { useSelector } from 'react-redux';

import stageUtils from '../../utils/stageUtils';
import Consts from '../../utils/consts';
import type { ReduxState } from '../../reducers';

const LinkToLogin: FunctionComponent = () => {
    const afterLogoutUrl = useSelector((state: ReduxState) => state.config.app.auth.afterLogoutUrl);
    const searchQuery = useSelector((state: ReduxState) => state.router.location.search);

    return stageUtils.Url.isLocalUrl(afterLogoutUrl) ? (
        <Link to={{ pathname: afterLogoutUrl.replace(Consts.CONTEXT_PATH, ''), search: searchQuery }}>
            {i18n.t('backToLogin')}
        </Link>
    ) : (
        <a href={afterLogoutUrl}>{i18n.t('backToLogin')}</a>
    );
};

export default LinkToLogin;
