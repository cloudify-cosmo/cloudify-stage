/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Header from '../../components/layout/Header';
import {resetPagesForTenant} from '../../actions/userApp';
import {newDeploymentTour, continueTour} from '../../actions/tour'

import {toogleSidebar} from '../../actions/app';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: state.manager || {},
        mode: state.config.mode,
        config: state.config,
        widgetDefinitions: state.widgetDefinitions
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onResetPages: (tenantList) =>{
            _.forEach(tenantList, tenant => {
                dispatch(resetPagesForTenant(tenant));
            });
        },
        onSidebarOpen(){
            dispatch(toogleSidebar());
        },
        onTourStart: () => {
           dispatch(newDeploymentTour());
        },
        continueTour: () => {
            dispatch(continueTour());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);