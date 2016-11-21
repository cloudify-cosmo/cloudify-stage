/**
 * Created by kinneretzin on 17/11/2016.
 */

'use strict';

import jsdom from 'jsdom';

import _ from 'lodash';
import $ from 'jquery';

global.document = jsdom.jsdom('<html><body></body></html>');
global.window = document.defaultView;
global.navigator = window.navigator;

global._ = _;
global.$ = $;

function noop() {
    return {};
}

// prevent mocha tests from breaking when trying to require a css file
require.extensions['.css'] = noop;
require.extensions['.svg'] = noop;
