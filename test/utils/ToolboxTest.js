/**
 * Created by kinneretzin on 03/01/2017.
 */

/**
 * Created by kinneretzin on 11/12/2016.
 */
import { expect } from 'chai';
import sinon from 'sinon';

import configureMockStore from 'redux-mock-store';
import { createToolbox, getToolbox } from '../../app/utils/Toolbox';

const mockStore = configureMockStore();

describe('(Utils) Toolbox', () => {
    const initialState = {
        templates: {
            tmp1: {
                name: 'tmp1',
                widgets: [{ name: 'some widget', definition: 'widet1g' }]
            }
        },
        manager: {
            ip: '1.1.1.1'
        },
        context: {},
        config: { widgets: {} },
        widgetDefinitions: [{ id: 'widget1' }]
    };

    const store = mockStore(initialState);
    createToolbox(store);

    it('Toolbox created properly', () => {
        const toolbox = getToolbox(() => {});

        expect(toolbox.store).to.exist;
    });

    /**
     * I didnt find anything major to test. Its majorly a hub of stuff that needs to be tested speperatly.
     */
});
