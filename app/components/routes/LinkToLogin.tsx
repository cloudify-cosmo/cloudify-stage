import type { FunctionComponent } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import { connect } from 'react-redux';
import Consts from '../../utils/consts';
import type { ReduxState } from '../../reducers';
import StageUtils from '../../utils/stageUtils';

interface LinkToLoginProps {
    portalUrl?: string;
    searchQuery?: string;
}
const LinkToLogin: FunctionComponent<LinkToLoginProps> = ({ portalUrl, searchQuery }) =>
    portalUrl ? (
        <a href={portalUrl}>{i18n.t('backToApps')}</a>
    ) : (
        <Link to={{ pathname: Consts.PAGE_PATH.LOGIN, search: searchQuery }}>{i18n.t('backToLogin')}</Link>
    );

const mapStateToProps = (state: ReduxState) => {
    return {
        portalUrl: !StageUtils.Idp.isLocal(state.manager) ? state.config.app.auth.portalUrl : undefined,
        searchQuery: state.router.location.search
    };
};

export default connect(mapStateToProps)(LinkToLogin);
