/**
 * Created by jakub.niezgoda on 07/03/2018.
 */

import { connect } from 'react-redux';
import WidgetsList from '../components/WidgetsList';
import stageUtils from '../utils/stageUtils';

const mapStateToProps = (state, ownProps) => {
    let manager = state.manager || {};
    let widgets = ownProps.widgets;

    if (!_.isEmpty(widgets)) {
        widgets = widgets.filter((widget) => widget.definition && stageUtils.isUserAuthorized(widget.definition.permission, manager));
    }

    return {
        pageId: ownProps.pageId,
        widgets: widgets,
        onWidgetsGridDataChange: ownProps.onWidgetsGridDataChange,
        isEditMode: ownProps.isEditMode,
        pageManagementMode: ownProps.pageManagementMode
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WidgetsList);

