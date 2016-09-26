import * as types from '../actions/types';

const managers = (state = {}, action) => {
    switch (action.type) {

        case types.SET_MANAGER:
            return {
                selected: 1,
                items: [{
                    id: 1,
                    name: action.name,
                    ip: action.ip
                }]
            };
        default:
            return state;
    }
};

export default managers;