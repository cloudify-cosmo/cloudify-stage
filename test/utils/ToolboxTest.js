/**
 * Created by kinneretzin on 03/01/2017.
 */

'use strict';

/**
 * Created by kinneretzin on 11/12/2016.
 */
import {expect} from 'chai';
import sinon from 'sinon';

import {createToolbox,getToolbox} from '../../app/utils/Toolbox';

import configureMockStore from 'redux-mock-store';
const mockStore = configureMockStore();

describe('(Utils) Toolbox', () => {

    var initialState = {
        templates: {
            'tmp1' : {
                name: 'tmp1',
                widgets: [{name: 'some widget',plugin: 'plugin1'}]
            }
        },
        manager : {
            ip: '1.1.1.1'
        },
        conetxt: {},
        plugins: [{id: 'plugin1'}]
    };

    const store = mockStore(initialState);
    createToolbox(store);

    it('Toolbox created properly', () => {
        var toolbox = getToolbox(()=>{});

        expect(toolbox.store).to.exist;
    });

    /**
     * I didnt find anything major to test. Its majorly a hub of stuff that needs to be tested speperatly.
     */
});
