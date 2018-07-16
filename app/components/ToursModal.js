/**
 * Created by edenp on 15/04/2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class ToursModal extends React.Component {

    constructor(props,context) {
        super(props,context);

    }

    static propTypes = {
        tours: PropTypes.array.isRequired,
        open: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        onTourStart: PropTypes.func.isRequired
    };

    startTour(tour) {
        this.props.onClose();
        this.props.onTourStart(tour);
    }

    render() {
        var {Sticky} = Stage.Basic;

        return (
            <Sticky>
                {
                    _.isEmpty(this.props.tours)
                    ?
                        <div>Oopsie looks like you don't have any tours assigned to you</div>
                    :
                        <div>
                            <List relaxed>
                                {this.props.tours.map((tour) => {
                                    return (
                                        <List.Item key={tour.id}>
                                            <Button basic color='blue' onClick={() => this.startTour(tour)}>{tour.name}</Button>
                                        </List.Item>
                                    );
                                })}
                            </List>
                        </div>
                }
            </Sticky>
        );
    }
};
