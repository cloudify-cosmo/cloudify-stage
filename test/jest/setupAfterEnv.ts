import type { DOMWindow } from 'jsdom';
import { JSDOM } from 'jsdom';
import _, { noop } from 'lodash';
import d3 from 'd3';
import log from 'loglevel';
import moment from 'moment';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import Utils from 'utils/stageUtils';
import * as Basic from 'components/basic';
import i18nInit from './i18n';

configure({ adapter: new Adapter() });

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface Global {
            d3: typeof d3;
            moment: typeof moment;
            document: Document;
            HTMLElement: HTMLElement;
            window: DOMWindow;
            navigator: Navigator;
            _: typeof _;
            log: typeof log;
            React: typeof React;
            Stage: typeof Stage;
        }
    }
}
process.env.NODE_ENV = 'test';
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
global.document = jsdom.window.document;
global.window = jsdom.window;
global.navigator = window.navigator;

global._ = _;
global.d3 = d3;
global.moment = moment;
global.log = log;
global.Stage = { Basic, Shared: {}, Utils } as typeof Stage; // No need to include all properties
global.React = React;

i18nInit();

// prevent mocha tests from breaking when trying to require non-js file
require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.svg'] = noop;
require.extensions['.png'] = noop;

jest.mock('utils/SplashLoadingScreen');
