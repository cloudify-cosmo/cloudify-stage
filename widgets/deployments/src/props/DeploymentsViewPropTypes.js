export default {
    data: PropTypes.shape({
        blueprintId: PropTypes.string,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                blueprint_id: PropTypes.string,
                created_at: PropTypes.string,
                id: PropTypes.string,
                isSelected: PropTypes.bool,
                lastExecution: PropTypes.shape({}),
                nodeInstancesCount: PropTypes.number,
                nodeInstancesStates: PropTypes.objectOf(PropTypes.number),
                site_name: PropTypes.string,
                updated_at: PropTypes.string,
                visibility: PropTypes.string
            })
        ),
        total: PropTypes.number
    }).isRequired,
    widget: Stage.PropTypes.Widget.isRequired,
    fetchData: PropTypes.func,
    onSelectDeployment: PropTypes.func,
    onActOnExecution: PropTypes.func,
    onMenuAction: PropTypes.func,
    onSetVisibility: PropTypes.func,
    allowedSettingTo: PropTypes.arrayOf(PropTypes.string),
    noDataMessage: PropTypes.string,
    showExecutionStatusLabel: PropTypes.bool,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
