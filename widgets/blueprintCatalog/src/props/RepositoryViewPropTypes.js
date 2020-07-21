import DataPropType from './DataPropType';

export default {
    data: DataPropType.isRequired,
    widget: Stage.PropTypes.Widget.isRequired,
    fetchData: PropTypes.func,
    onSelect: PropTypes.func,
    onUpload: PropTypes.func,
    onReadme: PropTypes.func.isRequired,
    readmeLoading: PropTypes.string,
    noDataMessage: PropTypes.string.isRequired
};
