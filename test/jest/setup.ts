// @ts-nocheck File not migrated fully to TS
/**
 * Created by kinneretzin on 17/11/2016.
 */

import { JSDOM } from 'jsdom';
import _ from 'lodash';
import $ from 'jquery';
import d3 from 'd3';
import log from 'loglevel';
import moment from 'moment';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PropTypes from 'prop-types';
import React from 'react';
import i18nInit from './i18n';

configure({ adapter: new Adapter() });

function noop() {
    return {};
}

process.env.NODE_ENV = 'test';
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = jsdom.window.document;
global.window = jsdom.window;
global.window.open = noop;
global.navigator = window.navigator;
Object.keys(document.defaultView).forEach(property => {
    if (typeof global[property] === 'undefined') {
        global[property] = document.defaultView[property];
    }
});

global.$ = $;
global.jQuery = $;
global.window.$ = $;
global.window.jQuery = $;
global._ = _;
global.d3 = d3;
global.moment = moment;
global.HTMLElement = window.HTMLElement;
global.log = log;
global.Stage = { defineCommon: noop };
global.PropTypes = PropTypes;
global.React = React;
global.ResizeObserver = function ResizeObserver() {
    return { observe: jest.fn(), unobserve: jest.fn() };
};

i18nInit();

// prevent mocha tests from breaking when trying to require non-js file
require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.svg'] = noop;
require.extensions['.png'] = noop;
