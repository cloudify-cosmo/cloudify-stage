import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import type { History } from 'history';

import throttle from 'lodash/throttle';
import StatePersister from './utils/StatePersister';
import type { ClientConfig } from './utils/ConfigLoader';

import createRootReducer, { ReduxState } from './reducers';
import { emptyState } from './reducers/managerReducer';

export default (history: History, config: ClientConfig) => {
    const reduxManagerState: Required<Pick<ReduxState, 'manager'>> = StatePersister.load(config.mode) || {
        manager: emptyState
    };

    // Clear login error if has any
    reduxManagerState.manager.err = null;
    reduxManagerState.manager.isLoggingIn = false;

    const initialState: Partial<ReduxState> = { ...reduxManagerState, config };

    const store = createStore(
        createRootReducer(history),
        initialState,
        composeWithDevTools(applyMiddleware(thunkMiddleware, routerMiddleware(history)))
    );

    // This saves the manager data in the local storage. This is good for when a user refreshes the page we can know if he is logged in or not, and save his login info - ip, username
    store.subscribe(
        throttle(() => {
            StatePersister.save(store.getState(), config.mode);
        }, 1000)
    );

    return store;
};
