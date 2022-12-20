import type { ThunkDispatch } from 'redux-thunk';
import thunkMiddleware from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import type { Action, Store, StoreEnhancer } from 'redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import type { History } from 'history';

import throttle from 'lodash/throttle';
import type { ClientConfig } from 'backend/routes/Config.types';
import ManagerStatePersister from './utils/ManagerStatePersister';

import type { ReduxState } from './reducers';
import createRootReducer from './reducers';
import type { ReduxAction } from './actions/types';
import { ActionType } from './actions/types';

export type ReduxThunkDispatch<A extends Action = ReduxAction> = ThunkDispatch<ReduxState, never, A>;
export type ReduxStore<State = ReduxState> = Store<State> & { dispatch: ReduxThunkDispatch };

function enhancedComposeWithDevTools<StoreExt>(...funcs: Array<StoreEnhancer<StoreExt>>): StoreEnhancer<StoreExt> {
    type ActionSanitizer = <A extends Action>(action: A) => A;

    const getActionWithReadableType: ActionSanitizer = action =>
        action.type in ActionType
            ? {
                  ...action,
                  type: ActionType[action.type]
              }
            : action;

    return composeWithDevTools({ actionSanitizer: getActionWithReadableType })(...funcs);
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
