/**
 * Created by edenp on 15/04/2018.
 */

import hopscotch from 'hopscotch';
import { push } from 'connected-react-router';

import * as types from './types';
import Tours from '../utils/Tours';

function hopscotchRegisterHelpers(dispatch) {
    hopscotch.registerHelper('redirectTo', function(url, selector) {
        const minVisibilityTime = 500; //ms
        const maxWaitingTime = 10000; //ms

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const rafAsync = () => new Promise(resolve => requestAnimationFrame(resolve));
        const setLoading = () => new Promise((resolve) => $('button.hopscotch-cta').addClass('ui button loading') && resolve());

        let isWaitingTimeExceeded = false;
        const waitingTimeout = setTimeout(() => isWaitingTimeExceeded = true, maxWaitingTime);

        const waitForElementVisible = (selector, isVisibilityConfirmed = false) => {
            const element = document.querySelector(selector);
            const isElementVisible = (element !== null && window.getComputedStyle(element).display !== 'none');

            if (isElementVisible) {
                if (isVisibilityConfirmed) {
                    clearTimeout(waitingTimeout);
                    return Promise.resolve('Element for selector ' + selector + ' found.');
                } else {
                    return delay(minVisibilityTime).then(() => waitForElementVisible(selector, true));
                }
            } else {
                if (isWaitingTimeExceeded) {
                    return Promise.reject('Element for selector ' + selector + ' not found.')
                } else {
                    return rafAsync().then(() => waitForElementVisible(selector));
                }
            }
        };

        return setLoading()
            .then(dispatch(push(url)))
            .then(() => waitForElementVisible(selector))
            .catch((msg) => console.error(msg))
            .finally(() => hopscotch.nextStep())
    });
}

function hopscotchStartTour(tour, dispatch) {
    hopscotch.startTour(Tours.parseTour(tour, dispatch));
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
        hopscotchRegisterHelpers(dispatch);
        return Tours.load(getState().manager)
            .then(result => dispatch(storeTours(result)));
    }
}

export function startTour(tour) {
    return function (dispatch, getState) {
        let path = getState().router.location.pathname;
        if (!_.isNil(tour.startAt) && tour.startAt !== path) {
            sessionStorage.setItem('startedTour', tour.id);
            return Promise.resolve(dispatch(push(tour.startAt)))
               .then(() => hopscotchStartTour(tour, dispatch));
        } else {
            hopscotchStartTour(tour, dispatch);
        }
    }
}

export function continueTour() {
    return function (dispatch, getState) {
        let tours = getState().tours;

        // Checks for a initialized tour that redirected to a different page before starting
        let startedTourId = sessionStorage.getItem('startedTour');
        if (startedTourId) {
            sessionStorage.removeItem('startedTour');
            hopscotchStartTour(getTourById(tours, startedTourId), dispatch);
        } else {
            // Checks for a multipage tour in progress
            let currentTour = hopscotch.getState();
            if(currentTour){
                hopscotchStartTour(getTourById(tours, currentTour.split(':')[0]), dispatch);
            }
        }
    }
}
