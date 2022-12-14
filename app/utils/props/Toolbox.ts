import PropTypes from 'prop-types';

const ToolboxPropType = PropTypes.shape({
    drillDown: PropTypes.func,
    getContext: PropTypes.func,
    getEventBus: PropTypes.func,
    getManager: PropTypes.func,
    getManagerState: PropTypes.func,
    getWidget: PropTypes.func,
    getWidgetBackend: PropTypes.func,
    goToPage: PropTypes.func,
    goToParentPage: PropTypes.func,
    loading: PropTypes.func,
    refresh: PropTypes.func
});
export default ToolboxPropType;
