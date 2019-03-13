/**
 * Created by jakub.niezgoda on 11/07/18.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Grid, Segment } from './basic';
import SplashLoadingScreen from '../utils/SplashLoadingScreen';

export default class MessageContainer extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        textAlign: PropTypes.string,
        loading: PropTypes.bool,
        size: PropTypes.string,
        wide: PropTypes.bool
    };

    static defaultProps = {
        textAlign: 'center',
        loading: false,
        size: 'big',
        wide: false
    };

    render () {
        SplashLoadingScreen.turnOff();

        const style = {margin: '80px auto', textAlign: this.props.textAlign};
        const widths = this.props.wide
            ? {mobile: 14, tablet: 14, computer: 12}
            : {mobile: 12, tablet: 8, computer: 6};

        return (
            <Grid centered container columns={1}>
                <Grid.Column {...widths}>
                    <Segment size={this.props.size} padded raised style={style}
                             loading={this.props.loading}>
                        {this.props.children}
                    </Segment>
                </Grid.Column>
            </Grid>
        );
    }
}