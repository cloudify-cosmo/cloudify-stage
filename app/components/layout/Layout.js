/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import Header from '../../containers/layout/Header';
import Footer from './Footer';


export default class Layout extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
    };

    render() {
        return (
            <div>
                <Header />

                {this.props.children}

                {/*
                <Footer/>
                 */}
            </div>
        );

    }
}
