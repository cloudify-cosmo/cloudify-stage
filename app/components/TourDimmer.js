/**
 * Created by edenp on 28/03/2018.
 */

import React, { Component, PropTypes } from 'react';
import { Button, Dimmer, Header, Icon } from 'semantic-ui-react'

export default class TourDimmer extends Component {

    constructor(props,context) {
        super(props, context);

        this.state = {
            showDimmer: false
        }
    }

    static propTypes = {
        shouldShowDimmer: PropTypes.func.isRequired,
        onTourDone: PropTypes.func.isRequired,
        startTour: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        this.setState({showDimmer: nextProps.shouldShowDimmer()});
    }

    handleClose() {
        this.props.onTourDone();
        this.setState({showDimmer: false});
    }

    handleStartTour() {
        this.props.onTourDone();
        this.setState({showDimmer: false});
        this.props.startTour();
    }

    render () {
        return (
            <Dimmer
                active={this.state.showDimmer}
                onClickOutside={this.handleClose.bind(this)}
                page
            >
                <Header as='h2' inverted>
                    Welcome to Cloudify Console!
                    <Header.Subheader></Header.Subheader>
                </Header>
                <Button onClick={this.handleStartTour.bind(this)}>Start Tour</Button>
            </Dimmer>
        )
    }
}