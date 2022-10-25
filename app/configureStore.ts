import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import type { Action, StoreEnhancer } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import type { History } from 'history';

import throttle from 'lodash/throttle';
import ManagerStatePersister from './utils/ManagerStatePersister';

import type { ReduxState } from './reducers';
import createRootReducer from './reducers';
import type { ClientConfig } from '../backend/routes/Config.types';
import { ActionType } from './actions/types';

function enhancedComposeWithDevTools<StoreExt>(...funcs: Array<StoreEnhancer<StoreExt>>): StoreEnhancer<StoreExt> {
    type ActionSanitizer = <A extends Action>(action: A) => A;

    const readableActionTypes: ActionSanitizer = action =>
        action.type in ActionType
            ? {
                  ...action,
                  type: ActionType[action.type]
              }
            : action;

    return composeWithDevTools({ actionSanitizer: readableActionTypes })(...funcs);
}

export default (history: History, config: ClientConfig) => {
    const managerState = ManagerStatePersister.load(config.mode);

    const initialState: Partial<ReduxState> = { manager: managerState, config };

    const store = createStore(
        createRootReducer(history),
        initialState,
        enhancedComposeWithDevTools(applyMiddleware(thunkMiddleware, routerMiddleware(history)))
    );

    // This saves the manager data in the local storage. This is good for when a user refreshes the page we can know if he is logged in or not, and save his login info - ip, username
    store.subscribe(
        throttle(() => {
            ManagerStatePersister.save(store.getState().manager, config.mode);
        }, 1000)
    );

    return store;
};
