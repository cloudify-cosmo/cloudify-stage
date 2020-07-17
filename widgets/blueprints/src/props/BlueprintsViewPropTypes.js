import DataPropType from './DataPropType';

export default {
    data: DataPropType.isRequired,
    widget: Stage.Common.PropTypes.Widget.isRequired,
    toolbox: Stage.Common.PropTypes.Toolbox.isRequired,
    fetchData: PropTypes.func,
    onSelectBlueprint: PropTypes.func,
    onDeleteBlueprint: PropTypes.func,
    onCreateDeployment: PropTypes.func,
    onSetVisibility: PropTypes.func,
    noDataMessage: PropTypes.string
};
