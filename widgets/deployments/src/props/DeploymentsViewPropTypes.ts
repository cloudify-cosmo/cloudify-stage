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
    fetchData: PropTypes.func.isRequired,
    onSelectDeployment: PropTypes.func.isRequired,
    onActOnExecution: PropTypes.func.isRequired,
    onDeploymentAction: PropTypes.func.isRequired,
    onWorkflowAction: PropTypes.func.isRequired,
    onSetVisibility: PropTypes.func.isRequired,
    allowedSettingTo: PropTypes.arrayOf(PropTypes.string),
    noDataMessage: PropTypes.string.isRequired,
    showExecutionStatusLabel: PropTypes.bool.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

export interface DeploymentViewData {
    blueprintId: string;
    items: {
        // eslint-disable-next-line camelcase
        blueprint_id: string;
        // eslint-disable-next-line camelcase
        created_at: string;
        id: string;
        isSelected: boolean;
        lastExecution: Record<string, any>;
        nodeInstancesCount: number;
        nodeInstancesStates: Record<string, number>;
        // eslint-disable-next-line camelcase
        site_name: string;
        // eslint-disable-next-line camelcase
        updated_at: string;
        visibility: string;
    }[];
    total: number;
}

export interface DeploymentViewProps {
    data: DeploymentViewData;
    widget: Stage.PropTypes.Widget.isRequired;
    // fetchData: PropTypes.func.isRequired,
    // onSelectDeployment: PropTypes.func.isRequired,
    // onActOnExecution: PropTypes.func.isRequired,
    // onDeploymentAction: PropTypes.func.isRequired,
    // onWorkflowAction: PropTypes.func.isRequired,
    // onSetVisibility: PropTypes.func.isRequired,
    allowedSettingTo: string[];
    noDataMessage: string;
    showExecutionStatusLabel: boolean;
    // toolbox: Stage.PropTypes.Toolbox.isRequired
}
