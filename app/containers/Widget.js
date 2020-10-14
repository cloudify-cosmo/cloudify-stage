/**
 * Created by kinneretzin on 11/09/2016.
 */

import _ from 'lodash';
import { connect } from 'react-redux';
import Widget from '../components/Widget';
import { setValue } from '../actions/context';
import { fetchWidgetData } from '../actions/WidgetData';

const mapStateToProps = (state, ownProps) => {
    return {
        context: state.context,
        manager: state.manager || {},
        widgetData: _.find(state.widgetData, { id: ownProps.widget.id }) || {}
    };
};

const mapDispatchToProps = (dispatch /* , ownProps */) => {
    return {
        setContextValue: (key, value) => {
            dispatch(setValue(key, value));
        },
        fetchWidgetData: (widget, toolbox, paramsHandler) => {
            return dispatch(fetchWidgetData(widget, toolbox, paramsHandler));
        }
    };
};

const WidgetW = connect(
    mapStateToProps,
    mapDispatchToProps
)(Widget);

export default WidgetW;
