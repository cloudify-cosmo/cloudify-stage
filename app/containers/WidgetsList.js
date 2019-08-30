/**
 * Created by jakub.niezgoda on 07/03/2018.
 */

import { connect } from 'react-redux';
import WidgetsList from '../components/WidgetsList';
import stageUtils from '../utils/stageUtils';

const mapStateToProps = (state, ownProps) => {
    const manager = state.manager || {};
    let { widgets } = ownProps;

    if (!_.isEmpty(widgets)) {
        widgets = widgets.filter(widget => {
            return (
                widget.definition &&
                stageUtils.isUserAuthorized(widget.definition.permission, manager) &&
                stageUtils.isWidgetPermitted(widget.definition.supportedEditions, manager)
            );
        });
    }

    return {
        pageId: ownProps.pageId,
        widgets,
        onWidgetsGridDataChange: ownProps.onWidgetsGridDataChange,
        isEditMode: ownProps.isEditMode,
        pageManagementMode: ownProps.pageManagementMode
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WidgetsList);
