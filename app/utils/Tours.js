/**
 * Created by edenp on 15/04/2018.
 */

import _ from 'lodash';
import log from 'loglevel';
import Internal from './Internal';
import Consts from './consts';

export default class Tours {
    static load(manager) {
        log.log('Load tours');

        const tenant = _.get(manager, 'tenants.selected', Consts.DEFAULT_ALL);

        const internal = new Internal(manager);
        return internal.doGet('/tours', { tenant }).then(tours => {
            return tours;
        });
    }

    static parseTour(tour) {
        const hopscotchTour = _.omit(_.cloneDeep(tour), ['name', 'startAt']);

        hopscotchTour.onClose = ['onTourClose'];
        hopscotchTour.onStart = ['onTourStart'];
        hopscotchTour.onError = ['showError'];
        hopscotchTour.skipIfNoElement = false;
        hopscotchTour.steps = _.map(hopscotchTour.steps, (step, index) => {
            const nextStep = hopscotchTour.steps[index + 1];
            let newStep = step;

            if (!_.isUndefined(nextStep)) {
                newStep.showCTAButton = true;
                newStep.showNextButton = false;
                newStep.ctaLabel = 'Next';
                newStep.onCTA = ['redirectTo', nextStep.target];
                if (!_.isUndefined(newStep.onNextRedirectTo)) {
                    const [url, pageName, noTargetErrorTitle, noTargetErrorMessage] = _.isArray(
                        newStep.onNextRedirectTo
                    )
                        ? newStep.onNextRedirectTo
                        : [newStep.onNextRedirectTo, newStep.onNextRedirectTo, undefined, undefined];
                    newStep.ctaLabel = 'Next (change page)';
                    newStep.onCTA = [
                        'redirectTo',
                        nextStep.target,
                        url,
                        pageName,
                        noTargetErrorTitle,
                        noTargetErrorMessage
                    ];
                    newStep = _.omit(newStep, 'onNextRedirectTo');
                }
            }

            return newStep;
        });

        return hopscotchTour;
    }
}
