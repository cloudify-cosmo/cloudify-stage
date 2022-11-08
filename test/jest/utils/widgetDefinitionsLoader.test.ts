import fetchMock from 'fetch-mock';

import ScriptLoader from 'utils/scriptLoader';
import type { InitialWidgetDefinition } from 'utils/StageAPI';
import WidgetDefinitionsLoader from 'utils/widgetDefinitionsLoader';
import type { ManagerData } from 'reducers/managerReducer';

const initialWidgetDefinition: InitialWidgetDefinition<unknown, unknown, unknown> = {
    id: 'testWidget',
    name: 'Test Widget',
    isReact: false,
    render: () => 'The rendered content of the test widget'
};

function loadMockWidgetDefinition(
    widgetDefinition: InitialWidgetDefinition<unknown, unknown, unknown>,
    widgetDirectoryName: string
) {
    fetchMock.get('/console/widgets', {
        body: [{ id: widgetDirectoryName, isCustom: false }]
    });

    jest.spyOn(ScriptLoader.prototype, 'load').mockImplementation(function load(this: ScriptLoader) {
        if (!this.path.endsWith(`${widgetDirectoryName}/widget.js`)) {
            return Promise.resolve();
        }

        const initialCurrentScriptPropertyDescriptor = Object.getOwnPropertyDescriptor(document, 'currentScript');

        Object.defineProperty(document, 'currentScript', {
            value: { id: widgetDirectoryName },
            configurable: true
        });

        Stage.defineWidget(widgetDefinition);

        if (initialCurrentScriptPropertyDescriptor) {
            Object.defineProperty(document, 'currentScript', initialCurrentScriptPropertyDescriptor);
        }

        return Promise.resolve();
    });
}

describe('(Utils) widgetDefinitionsLoader', () => {
    beforeEach(() => {
        WidgetDefinitionsLoader.init();
    });

    afterEach(fetchMock.restore);

    it('should execute `init` function when loading a widget', async () => {
        const widgetDefinition: InitialWidgetDefinition<unknown, unknown, unknown> = {
            ...initialWidgetDefinition,
            init: jest.fn()
        };
        loadMockWidgetDefinition(widgetDefinition, widgetDefinition.id);

        await WidgetDefinitionsLoader.loadWidget({ id: widgetDefinition.id, isCustom: false });

        expect(widgetDefinition.init).toHaveBeenCalledTimes(1);
    });

    it('should load widgets list', async () => {
        loadMockWidgetDefinition(initialWidgetDefinition, initialWidgetDefinition.id);

        const loadedWidgetDefinitions = await WidgetDefinitionsLoader.load({} as ManagerData);

        expect(loadedWidgetDefinitions).toHaveLength(1);
        expect(loadedWidgetDefinitions[0]).toEqual({
            id: initialWidgetDefinition.id,
            isCustom: false,
            loaded: false
        });
    });

    it('should set widget ID to widget directory name', async () => {
        const widgetDefinition = {
            ...initialWidgetDefinition,
            id: 'arbitrary widget ID that does not match the widget directory name'
        };
        loadMockWidgetDefinition(widgetDefinition, initialWidgetDefinition.id);

        const loadedWidgetDefinitions = await WidgetDefinitionsLoader.load({} as ManagerData);

        expect(loadedWidgetDefinitions).toHaveLength(1);
        expect(loadedWidgetDefinitions[0].id).not.toBe(widgetDefinition.id);
    });
});
