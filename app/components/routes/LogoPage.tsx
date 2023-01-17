import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Consts from '../../utils/consts';

import { FullScreenSegment, Logo } from '../basic';
import ErrorPage from './ErrorPage';
import NoTenantsPage from './NoTenantsPage';
import NotFoundPage from './NotFoundPage';

export default function LogoPage() {
    return (
        <FullScreenSegment>
            <Logo />
            <Switch>
                <Route exact path={Consts.PAGE_PATH.ERROR} component={ErrorPage} />
                <Route exact path={Consts.PAGE_PATH.ERROR_NO_TENANTS} component={NoTenantsPage} />
                <Route exact path={Consts.PAGE_PATH.ERROR_404} component={NotFoundPage} />
            </Switch>
        </FullScreenSegment>
    );
}
