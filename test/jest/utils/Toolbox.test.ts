import configureMockStore from 'redux-mock-store';
import { createToolbox, getToolbox } from 'utils/Toolbox';
import type { ReduxState } from 'reducers';
import type { ReduxStore } from 'configureStore';

const mockStore = configureMockStore<Partial<ReduxState>>();

describe('(Utils) Toolbox', () => {
    const initialState: Partial<ReduxState> = {};

    const store = mockStore(initialState) as ReduxStore;
    createToolbox(store);

    it('Toolbox created properly', () => {
        const onRefresh = jest.fn();
        const onLoading = jest.fn();
        const toolbox = getToolbox(onRefresh, onLoading);

        toolbox.loading();
        expect(onLoading).toHaveBeenCalled();

        toolbox.refresh();
        expect(onRefresh).toHaveBeenCalled();
    });

    /**
     * I didnt find anything major to test. Its majorly a hub of stuff that needs to be tested speperatly.
     */
});
