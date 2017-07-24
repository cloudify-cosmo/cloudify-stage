/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import SideBar from '../components/SideBar';


const mapStateToProps = (state, ownProps) => {
    var homePageId = state.pages[0].id;
    return {
        homePageId,
        pageId:     ownProps.pageId || homePageId,
        isEditMode: state.config.isEditMode || false
    }
};


const SideBarW = connect(
    mapStateToProps,
    {} //mapDispatchToProps
)(SideBar);


export default SideBarW