/**
 * Created by jakub.niezgoda on 20/06/2018.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Consts from '../utils/consts';

export default class Logo extends Component {
    static propTypes = {
        pageTitle: PropTypes.string.isRequired
    };

    render () {
        return (
            <Link to={Consts.HOME_PAGE_PATH} title={this.props.pageTitle}><div className='logo' /></Link>
        )
    }
}