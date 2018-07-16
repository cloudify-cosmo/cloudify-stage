/**
 * Created by jakub.niezgoda on 11/07/18.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Container, Segment } from './basic';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

export default class MessageContainer extends Component {

    static propTypes = {
        children: PropTypes.object.isRequired,
        className: PropTypes.string
    };

    static defaultProps = {
        className: 'messageSegment'
    };

    render () {
        SplashLoadingScreen.turnOff();

        return (
            <div className='coloredContainer'>
                <Container fluid textAlign='center'>
                    <Segment size='big' padded textAlign='center' raised className={this.props.className}>
                        {this.props.children}
                    </Segment>
                </Container>
            </div>
        );
    }
}