/**
 * Created by kinneretzin on 29/08/2016.
 */

import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import Layout from './components/layout/Layout';
import Home from './components/Home';
import NotFound from './components/NotFound';

export default (
    <Route path="/" component={Layout}>
        <Route path='/page/(:pageId)' component={Home}/>
        <Route path="404" component={NotFound} />
        <IndexRoute component={Home} params={{pageId:0}}/>
        <Redirect from="*" to="404" />
    </Route>
);
