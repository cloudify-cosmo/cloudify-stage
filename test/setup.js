/**
 * Created by kinneretzin on 17/11/2016.
 */

import jsdom from 'jsdom';
import _ from 'lodash';
import $ from 'jquery';
import d3 from 'd3';
import moment from 'moment';
import chai from 'chai';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

process.env.NODE_ENV = 'test';
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;
Object.keys(document.defaultView).forEach(property => {
    if (typeof global[property] === 'undefined') {
        global[property] = document.defaultView[property];
    }
});

global.$ = global.jQuery = global.window.$ = global.window.jQuery = $(window);
global._ = _;
global.d3 = d3;
global.moment = moment;
global.HTMLElement = window.HTMLElement;

chai.use(require('chai-enzyme')());
chai.use(require('sinon-chai'));

function noop() {
    return {};
}

// prevent mocha tests from breaking when trying to require a css file
require.extensions['.css'] = noop;
require.extensions['.svg'] = noop;

// For the window.location to work...
jsdom.changeURL(window, 'http://myhost:8088/');
