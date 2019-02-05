/**
 * Created by edenp on 15/04/2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import {Button, Menu, Popup, PopupMenu} from './basic';

export default class ToursButton extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            open: false,
            hovered: false
        }
    }

    static propTypes = {
        tours: PropTypes.array.isRequired,
        onTourStart: PropTypes.func.isRequired
    };

    startTour(tour) {
        this.props.onTourStart(tour);
    }

    _onMouseOver() {
        this.setState({hovered: true})
    }

    _onMouseOut() {
        this.setState({hovered: false})
    }

    render() {

        const buttonStyle = {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: 9,
            opacity: this.state.hovered ? 1 : 0.5
        };

        return !_.isEmpty(this.props.tours) &&
            <PopupMenu onClose={this._onMouseOut.bind(this)}>
                <Popup.Trigger>
                    <Button title='Take a tour' circular color='blue' size='huge' icon='map signs' id='toursButton'
                            onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)}
                            style={buttonStyle} onClick={(e) => e.stopPropagation()} />
                </Popup.Trigger>
                <Menu vertical>
                    <Menu.Item header>Tours</Menu.Item>
                    {
                        this.props.tours.map((tour) => (
                            <Menu.Item key={tour.id} onClick={() => this.startTour(tour)}>{tour.name}</Menu.Item>
                        ))
                    }
                </Menu>
            </PopupMenu>
        ;
    }
};
