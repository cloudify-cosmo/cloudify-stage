/**
 * Created by edenp on 15/04/2018.
 */

import * as types from './types';
import Tours from '../utils/Tours';
import hopscotch from 'hopscotch';

function hopscotchStartTour(tour) {
    hopscotch.startTour(Tours.parseTour(tour));
}

function getTourById(tours, tourId) {
    return _.find(tours, {'id': tourId});
}

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

export function redirectStartTour(tourId, redirectTo) {
    return function (dispatch) {
        sessionStorage.setItem('startedTour', tourId);
        window.location = redirectTo;
    }
}

export function startTour(tour) {
    return function (dispatch) {
        hopscotchStartTour(tour);
    }
}

export function continueTour() {
    return function (dispatch, getState) {
        var tours = getState().tours;

        // Checks for a initialized tour that redirected to a different page before starting
        var startedTourId = sessionStorage.getItem('startedTour');
        if(startedTourId){
            sessionStorage.removeItem('startedTour');
            hopscotchStartTour(getTourById(tours, startedTourId));
        }else{
            // Checks for a multipage tour in progress
            var currentTour = hopscotch.getState();
            if(currentTour){
                hopscotchStartTour(getTourById(tours, currentTour.split(':')[0]));
            }
        }
    }
}
