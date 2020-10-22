/**
 * Created by kinneretzin on 17/11/2016.
 */

import jsdom from 'jsdom';
import _ from 'lodash';
import $ from 'jquery';
import d3 from 'd3';
import log from 'loglevel';
import moment from 'moment';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

function noop() {
    return {};
}

process.env.NODE_ENV = 'test';
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
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

// prevent mocha tests from breaking when trying to require non-js file
require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.svg'] = noop;
require.extensions['.png'] = noop;
