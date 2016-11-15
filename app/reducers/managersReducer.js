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

        default:
            return state;
    }
};

export default managers;