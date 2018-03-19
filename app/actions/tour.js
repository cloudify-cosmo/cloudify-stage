/**
 * Created by edenp on 08/11/2017.
 */

import hopscotch from 'hopscotch';
// import _ from 'lodash';

var tours = [
    {
        id: "hello-hopscotch",
        steps: [
            {
                title: "My Header",
                content: "first page 1",
                target: document.querySelector(".logo"),
                placement: "right"
            },
            {
                title: "My content",
                content: "first page 2",
                target: document.querySelector(".logo"),
                placement: "right",
                multipage: true,
                onNext: () => {
                    window.location = "/stage/page/blueprints_catalog"
                }

            },
            {
                title: "My Header",
                content: "second page",
                target: document.querySelector(".logo"),
                placement: "right"
            }
        ]
    }
];

function getTourById(tourId) {
    return _.find(tours, {'id': tourId});
}

export function firstTour() {
    return function (dispatch) {
        hopscotch.startTour(getTourById('hello-hopscotch'));
    }
}

export function continueTour() {
    return function (dispatch) {
        var tour = hopscotch.getState();
        if(tour){
            hopscotch.startTour(getTourById(tour.split(':')[0]));
        }
    }
}