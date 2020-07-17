export default {
    data: PropTypes.shape({
        blueprintId: PropTypes.string,
        items: PropTypes.arrayOf(PropTypes.shape({})),
        total: PropTypes.number
    }).isRequired,
    widget: Stage.Common.PropTypes.Widget.isRequired,
    fetchData: PropTypes.func,
    onSelectDeployment: PropTypes.func,
    onActOnExecution: PropTypes.func,
    onMenuAction: PropTypes.func,
    onSetVisibility: PropTypes.func,
    allowedSettingTo: PropTypes.arrayOf(PropTypes.string),
    noDataMessage: PropTypes.string,
    showExecutionStatusLabel: PropTypes.bool,
    toolbox: Stage.Common.PropTypes.Toolbox.isRequired
};
