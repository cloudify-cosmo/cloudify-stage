/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Layout from './components/Layout';
import Page from './components/Page';
import NotFound from './components/NotFoundComponent';

export default (
    <Route path="/" component={Layout}>
        <IndexRoute component={Page} />
        <Route path="404" component={NotFound} />
        <Redirect from="*" to="404" />
    </Route>
);
