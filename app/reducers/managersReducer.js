import * as types from '../actions/types';

const managers = (state = {}, action) => {
    switch (action.type) {
        case types.REQ_LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: true
            });
        case types.RES_LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: false,
                selected: 1,
                items: [
                    {
                        id: 1,
                        ip: action.ip,
                        username: action.username,
                        auth: {
                            isSecured : true,
                            token: action.token
                        },
                        err: null,
                        version: action.version,
                        lastUpdated: action.receivedAt
                    }
                ]
            });
        case types.ERR_LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: false,
                selected: 1,
                items: [
                    {
                        id: 1,
                        ip: action.ip,
                        username: action.username,
                        auth: {
                            isSecured : true,
                            token: action.token
                        },
                        err: action.error,
                        lastUpdated: action.receivedAt
                    }
                ]
            });

        case types.SET_MANAGER_STATUS:
            return Object.assign({}, state, {
                items: [
                    Object.assign(state.items[0], {
                        status: action.status
                    })
                ]
            });
        default:
            return state;
    }
};

export default managers;