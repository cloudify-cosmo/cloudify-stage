/**
 * Created by edenp on 15/04/2018.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button, Menu, Popup, PopupMenu } from './basic';

export default class ToursButton extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            hovered: false
        };
    }

    startTour(tour) {
        const { onTourStart } = this.props;
        onTourStart(tour);
    }

    onMouseOver() {
        this.setState({ hovered: true });
    }

    onMouseOut() {
        this.setState({ hovered: false });
    }

    render() {
        const { tours } = this.props;
        const { hovered } = this.state;
        const buttonStyle = {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: 9,
            opacity: hovered ? 1 : 0.5
        };

        return (
            !_.isEmpty(tours) && (
                <PopupMenu onClose={this.onMouseOut.bind(this)}>
                    <Popup.Trigger>
                        <Button
                            title="Take a tour"
                            circular
                            color="blue"
                            size="huge"
                            icon="map signs"
                            id="toursButton"
                            onMouseOver={this.onMouseOver.bind(this)}
                            onMouseOut={this.onMouseOut.bind(this)}
                            style={buttonStyle}
                            onClick={e => e.stopPropagation()}
                        />
                    </Popup.Trigger>
                    <Menu vertical>
                        <Menu.Item header>Tours</Menu.Item>
                        {tours.map(tour => (
                            <Menu.Item key={tour.id} onClick={() => this.startTour(tour)}>
                                {tour.name}
                            </Menu.Item>
                        ))}
                    </Menu>
                </PopupMenu>
            )
        );
    }
}

ToursButton.propTypes = {
    tours: PropTypes.arrayOf(
        PropTypes.shape({ id: PropTypes.string, name: PropTypes.string, steps: PropTypes.arrayOf(PropTypes.shape({})) })
    ).isRequired,
    onTourStart: PropTypes.func.isRequired
};
