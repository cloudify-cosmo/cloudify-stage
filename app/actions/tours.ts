// @ts-nocheck File not migrated fully to TS
/**
 * Created by edenp on 15/04/2018.
 */

import _ from 'lodash';
import log from 'loglevel';
import hopscotch from 'hopscotch';
import { push } from 'connected-react-router';
import i18n from 'i18next';

import * as types from './types';
import Tours from '../utils/Tours';
import Consts from '../utils/consts';

function handleClick(event) {
    const isHopscotchElementClicked = _.includes(event.target.className, 'hopscotch');

    if (!isHopscotchElementClicked) {
        // eslint-disable-next-line no-use-before-define
        hopscotchEndTour(false);
    }
}

function handleKeyPressed(event) {
    const isEscapeKeyPressed = event.key === 'Escape';

    if (isEscapeKeyPressed) {
        // eslint-disable-next-line no-use-before-define
        hopscotchEndTour(false);
    }
}

function addStopTourEventsListeners() {
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPressed);
}

function removeStopTourEventsListeners() {
    document.removeEventListener('click', handleClick);
    document.removeEventListener('keydown', handleKeyPressed);
}

function waitForHopscotchElementsToBeClosed() {
    const listenerRemovalTimeout = 1000;
    let listenerRemovalTimeoutObject = null;

    const checkForRemainingHopscotchElements = () => {
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

function hopscotchEndTour(errorOccured) {
    hopscotch.endTour();

    if (errorOccured) {
        waitForHopscotchElementsToBeClosed();
    } else {
        hopscotch.getCalloutManager().removeAllCallouts();
        removeStopTourEventsListeners();
    }
}

function hopscotchRegisterHelpers(dispatch) {
    hopscotch.registerHelper('redirectTo', (selector, url, pageName, noSelectorErrorTitle, noSelectorErrorMessage) => {
        const minVisibilityTime = 500; // ms
        const maxWaitingTime = 5000; // ms
        const hopscotchButtonSelector = 'button.hopscotch-cta';
        const buttonLoadingClass = 'ui button loading';

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const rafAsync = () => new Promise(resolve => requestAnimationFrame(resolve));
        const setLoading = () =>
            new Promise(resolve => $(hopscotchButtonSelector).addClass(buttonLoadingClass) && resolve());

        let isWaitingTimeExceeded = false;
        const waitingTimeout = setTimeout(() => {
            isWaitingTimeExceeded = true;
        }, maxWaitingTime);

        const checkIfPageIsPresent = (pageUrl, name) => {
            if (!_.isEqual(window.location.pathname, `${Consts.CONTEXT_PATH}${pageUrl}`)) {
                hopscotch.getCalloutManager().createCallout({
                    id: 'error',
                    target: 'div.logo',
                    placement: 'bottom',
                    title: i18n.t('tours.noPage.title', 'No page'),
                    content: i18n.t(
                        'tours.noPage.message',
                        'Cannot find <strong>{{page}}</strong> page. Tours are intended to work only on default templates. Reset templates to finish this tour.',
                        { page: name || pageUrl }
                    )
                });

                return Promise.reject(`Page ${name} not found.`);
            }
            return Promise.resolve(`Page ${name} found.`);
        };

        const waitForElementVisible = (elSelector, isVisibilityConfirmed = false) => {
            const element = document.querySelector(elSelector);
            const isElementVisible = element !== null && window.getComputedStyle(element).display !== 'none';

            if (isElementVisible) {
                if (isVisibilityConfirmed) {
                    clearTimeout(waitingTimeout);
                    return Promise.resolve(`Element for selector ${elSelector} found.`);
                }
                return delay(minVisibilityTime).then(() => waitForElementVisible(elSelector, true));
            }
            if (isWaitingTimeExceeded) {
                hopscotch.getCalloutManager().createCallout({
                    id: 'error',
                    target: 'button#toursButton',
                    placement: 'top',
                    xOffset: -270,
                    arrowOffset: 270,
                    title: noSelectorErrorTitle || i18n.t('tours.noSelector.title', 'No element'),
                    content:
                        noSelectorErrorMessage ||
                        i18n.t('tours.noSelector.message', 'Cannot find element for the next tour step on the screen.')
                });

                return Promise.reject(`Element for selector ${elSelector} not found.`);
            }
            return rafAsync().then(() => waitForElementVisible(elSelector));
        };

        const redirect = !!url && !!pageName;
        return setLoading()
            .then(() => {
                if (redirect) {
                    dispatch(push(url));
                    return checkIfPageIsPresent(url, pageName);
                }
                return false;
            })
            .then(() => waitForElementVisible(selector))
            .then(() => hopscotch.nextStep())
            .catch(error => {
                log.error(error);
                hopscotchEndTour(true);
            });
    });
    hopscotch.registerHelper('onTourStart', addStopTourEventsListeners);
    hopscotch.registerHelper('onTourClose', removeStopTourEventsListeners);
    hopscotch.registerHelper('showError', content => {
        hopscotch.getCalloutManager().createCallout({
            id: 'error',
            target: 'button#toursButton',
            placement: 'top',
            xOffset: -270,
            arrowOffset: 270,
            title: i18n.t('tours.noTarget.title', 'No target element for next step'),
            content:
                content ||
                i18n.t(
                    'tours.noTarget.message',
                    'Cannot find target element. Tours are intended to work only on default templates. Reset templates to finish this tour.'
                )
        });
    });
}

function hopscotchStartTour(tour) {
    hopscotchEndTour(false);
    hopscotch.startTour(Tours.parseTour(tour));
}

export function storeTours(tours) {
    return {
        type: types.STORE_TOURS,
        tours
    };
}

export function loadTours() {
    return (dispatch, getState) => {
        hopscotchRegisterHelpers(dispatch);
        return Tours.load(getState().manager).then(result => dispatch(storeTours(result)));
    };
}

export function startTour(tour) {
    return (dispatch, getState) => {
        const path = getState().router.location.pathname;

        if (!_.isNil(tour.startAt) && tour.startAt !== path) {
            sessionStorage.setItem('startedTour', tour.id);
            return Promise.resolve(dispatch(push(tour.startAt))).then(() => hopscotchStartTour(tour));
        }

        return hopscotchStartTour(tour);
    };
}
