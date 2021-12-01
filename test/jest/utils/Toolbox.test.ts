// @ts-nocheck File not migrated fully to TS

import configureMockStore from 'redux-mock-store';
import { createToolbox, getToolbox } from 'utils/Toolbox';

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

        expect(toolbox.store).not.toBeUndefined();
        expect(toolbox.store).not.toBeNull();
    });

    /**
     * I didnt find anything major to test. Its majorly a hub of stuff that needs to be tested speperatly.
     */
});
