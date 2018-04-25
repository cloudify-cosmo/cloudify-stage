/**
 * Created by edenp on 15/04/2018.
 */

import * as types from './types';
import Tours from '../utils/Tours';
import hopscotch from 'hopscotch';


export function storeTours(tours) {
    return {
        type: types.STORE_TOURS,
        tours
    }
}

export function loadTours() {
    return function (dispatch, getState) {
        return Tours.load(getState().manager)
            .then(result => dispatch(storeTours(result)));
    }
}

export function startTour(tour) {
    return function (dispatch) {
        hopscotch.startTour(tour);
    }
}


function getTourById(tours, tourId) {
    return _.find(tours, {'id': tourId});
}

export function continueTour() {
    return function (dispatch, getState) {
        var tours = getState().tours;
        var currentTour = hopscotch.getState();
        if(currentTour){
            hopscotch.startTour(getTourById(tours, currentTour.split(':')[0]));
        }
    }
}
