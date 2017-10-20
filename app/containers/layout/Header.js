/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import Header from '../../components/layout/Header';
import {clearPagesForTenant} from '../../actions/userApp';
import {toogleSidebar} from '../../actions/app';

const mapStateToProps = (state, ownProps) => {
    return {
        manager: state.manager || {},
        mode: state.config.mode,
        config: state.config,
        templates: state.templates,
        widgetDefinitions: state.widgetDefinitions
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onResetTemplate: (tenantList) =>{
            _.forEach(tenantList, tennant => {
                dispatch(clearPagesForTenant(tennant));
            });
        },
        onSidebarOpen(){
            dispatch(toogleSidebar());
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);