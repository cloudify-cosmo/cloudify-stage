/**
 * Created by edenp on 15/04/2018.
 */

import hopscotch from 'hopscotch';
import { push } from 'connected-react-router';

import * as types from './types';
import Tours from '../utils/Tours';
import Consts from '../utils/consts';


function _handleClick(event) {
    const isHopscotchElementClicked = _.includes(event.target.className, 'hopscotch');

    if (!isHopscotchElementClicked) {
        hopscotchEndTour(false);
    }
}

function _handleKeyPressed(event) {
    const isEscapeKeyPressed = event.key === 'Escape';

    if (isEscapeKeyPressed) {
        hopscotchEndTour(false);
    }
}


function addStopTourEventsListeners() {
    document.addEventListener('click', _handleClick);
    document.addEventListener('keydown', _handleKeyPressed);
}

function removeStopTourEventsListeners() {
    document.removeEventListener('click', _handleClick);
    document.removeEventListener('keydown', _handleKeyPressed);
}

function waitForHopscotchElementsToBeClosed() {
    const listenerRemovalTimeout = 1000;
    let listenerRemovalTimeoutObject = null;

    let checkForRemainingHopscotchElements = () => {
        const hopscotchElementClass = '.hopscotch-bubble';

        if ($(hopscotchElementClass).length > 0) {
            listenerRemovalTimeoutObject = setTimeout(checkForRemainingHopscotchElements, listenerRemovalTimeout);
        } else {
            clearTimeout(listenerRemovalTimeoutObject);
            removeStopTourEventsListeners();
        }
    };

    listenerRemovalTimeoutObject = setTimeout(checkForRemainingHopscotchElements, listenerRemovalTimeout);
}

function hopscotchRegisterHelpers(dispatch) {
    hopscotch.registerHelper('redirectTo', function(url, pageName, selector, noSelectorErrorTitle, noSelectorErrorMessage) {
        const minVisibilityTime = 500; //ms
        const maxWaitingTime = 5000; //ms
        const hopscotchButtonSelector = 'button.hopscotch-cta';
        const buttonLoadingClass = 'ui button loading';

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const rafAsync = () => new Promise(resolve => requestAnimationFrame(resolve));
        const setLoading = () => new Promise((resolve) => $(hopscotchButtonSelector).addClass(buttonLoadingClass) && resolve());

        let isWaitingTimeExceeded = false;
        const waitingTimeout = setTimeout(() => isWaitingTimeExceeded = true, maxWaitingTime);

        const checkIfPageIsPresent = (pageUrl, pageName) => {
            if (!_.isEqual(window.location.pathname, `${Consts.CONTEXT_PATH}${pageUrl}`)) {
                hopscotch.getCalloutManager().createCallout({
                    id: 'error',
                    target: '.hopscotch-bubble-container',
                    placement: 'bottom',
                    title: 'No page',
                    content: `Cannot find <strong>${pageName || pageUrl}</strong> page. Tours are intended to work only on default templates. Reset templates to finish this tour.`
                });

                return Promise.reject('Page ' + pageName + ' not found.');
            } else {
                return Promise.resolve('Page ' + pageName + ' found.');
            }
        }

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
                    hopscotch.getCalloutManager().createCallout({
                        id: 'error',
                        target: '.hopscotch-bubble-container',
                        placement: 'bottom',
                        title: noSelectorErrorTitle || 'No element',
                        content: noSelectorErrorMessage || 'Cannot find element for the next tour step on the screen.'
                    });

                    return Promise.reject('Element for selector ' + selector + ' not found.')
                } else {
                    return rafAsync().then(() => waitForElementVisible(selector));
                }
            }
        };

        return setLoading()
            .then(dispatch(push(url)))
            .then(() => checkIfPageIsPresent(url, pageName))
            .then(() => waitForElementVisible(selector))
            .then(() => hopscotch.nextStep())
            .catch((error) => { console.error(error); hopscotchEndTour(true); } );
    });
    hopscotch.registerHelper('onTourStart', addStopTourEventsListeners);
    hopscotch.registerHelper('onTourClose', removeStopTourEventsListeners);
}

function hopscotchStartTour(tour) {
    hopscotchEndTour(false);
    hopscotch.startTour(Tours.parseTour(tour));
}

function hopscotchEndTour(errorOccured) {
    hopscotch.endTour();

    if (errorOccured) {
        waitForHopscotchElementsToBeClosed();
    } else {
        hopscotch.getCalloutManager().removeAllCallouts();
        removeStopTourEventsListeners();
    }
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
               .then(() => hopscotchStartTour(tour));
        } else {
            hopscotchStartTour(tour);
        }
    }
}