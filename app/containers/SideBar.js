/**
 * Created by addihorowitz on 19/09/2016.
 */

import React from 'react';
import { connect } from 'react-redux';
import SideBar from '../components/SideBar';


const mapStateToProps = (state, ownProps) => {
return {
        pageId:     ownProps.pageId || "0",
        isEditMode: state.config.isEditMode || false
    }
};


const SideBarW = connect(
    mapStateToProps,
    {} //mapDispatchToProps
)(SideBar);


export default SideBarW