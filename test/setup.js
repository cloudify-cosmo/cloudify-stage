/**
 * Created by kinneretzin on 17/11/2016.
 */

'use strict';

import jsdom from 'jsdom';
import _ from 'lodash';
import $ from 'jquery';
import chai from 'chai';

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        global[property] = document.defaultView[property];
    }
});

global.$ = global.jQuery = global.window.$ = global.window.jQuery = $(window);
global._ = _;

require('angular/angular');
require('angular-mocks');

global.angular = window.angular;
global.inject = global.angular.mock.inject;
global.ngModule = global.angular.mock.module;

chai.use(require('chai-enzyme')());
chai.use(require('sinon-chai'));

require('../semantic/dist/semantic');

function noop() {
    return {};
}

// prevent mocha tests from breaking when trying to require a css file
require.extensions['.css'] = noop;
require.extensions['.svg'] = noop;

// For the window.location to work...
jsdom.changeURL(window, 'http://myhost:8088/');