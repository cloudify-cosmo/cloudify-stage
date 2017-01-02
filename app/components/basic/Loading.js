/**
 * Created by kinneretzin on 01/01/2017.
 */


import React, { Component, PropTypes } from 'react';

export default class Loading extends Component {
    static propTypes = {
        message: PropTypes.string
    };

    static defaultProps = {
        message: 'Loading'
    };

    render() {
        return (
            <div className='ui segment basic' style={{height:'100%'}}>
                <div className='ui active inverted dimmer'>
                    <div className='ui text loader'>{this.props.message}</div>
                </div>
            </div>
        );
    }
}

