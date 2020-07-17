export default {
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    onLoading: PropTypes.func.isRequired,
    onReady: PropTypes.func.isRequired,
    stepData: PropTypes.shape({}).isRequired,
    wizardData: PropTypes.shape({}).isRequired,
    errors: PropTypes.shape({}).isRequired,
    loading: PropTypes.bool.isRequired,
    toolbox: Stage.Common.PropTypes.Toolbox.isRequired
};
