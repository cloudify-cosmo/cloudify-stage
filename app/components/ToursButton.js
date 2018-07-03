/**
 * Created by edenp on 15/04/2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

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
        let {Button, Menu, PopupMenu, Portal} = Stage.Basic;

        const buttonTrigger = (
            <Button title='Take a tour' circular color='blue' size='huge' icon='map signs' id='toursButton'
                    onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)}
                    style={{ right: '20px', position: 'fixed', bottom: '20px', zIndex: 1000, opacity: this.state.hovered ? 1 : 0.5 }} />
        );

        return !_.isEmpty(this.props.tours) &&
            <Portal className={this.props.className} open={true}>
                <PopupMenu trigger={buttonTrigger} onClose={this._onMouseOut.bind(this)}>
                    <Menu vertical>
                        <Menu.Item header>Tours</Menu.Item>
                        {
                            this.props.tours.map((tour) => (
                                <Menu.Item key={tour.id} onClick={() => this.startTour(tour)}>{tour.name}</Menu.Item>
                            ))
                        }
                    </Menu>
                </PopupMenu>
            </Portal>
        ;
    }
};
