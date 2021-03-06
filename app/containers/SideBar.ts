// @ts-nocheck File not migrated fully to TS
/**
 * Created by addihorowitz on 19/09/2016.
 */

import { connect } from 'react-redux';
import SideBar from '../components/SideBar';

const mapStateToProps = (state, ownProps) => {
    const homePageId = state.pages[0].id;
    return {
        homePageId,
        pageId: ownProps.pageId || homePageId,
        isEditMode: state.config.isEditMode || false,
        isOpen: state.app.sidebarIsOpen || false
    };
};

const SideBarW = connect(
    mapStateToProps,
    {} // mapDispatchToProps
)(SideBar);

export default SideBarW;
