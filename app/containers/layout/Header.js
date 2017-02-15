/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Header from '../../components/layout/Header';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: state.manager || {},
        mode: state.config.mode,
        whiteLabel : state.config.app.whiteLabel
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
};

const HeaderW = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);

export default HeaderW