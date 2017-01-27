/**
 * Created by jakubniezgoda on 27/01/2017.
 */

let PropTypes = React.PropTypes;

export default class extends React.Component {

    static propTypes = {
        item: PropTypes.object.isRequired,
        onCancelExecution: PropTypes.func.isRequired,
        showWorkflowId: PropTypes.bool,
        showInactive: PropTypes.bool,
        showInactiveAsLink : PropTypes.bool
    };

    static defaultProps = {
        showWorkflowId: true,
        showInactive: false,
        showInactiveAsLink: false
    };

    // TODO: Move to common place
    _isActive() {
        const EXECUTION_STATES = [ 'terminated', 'failed', 'cancelled', 'pending', 'started', 'cancelling', 'force_cancelling' ];
        const END_EXECUTION_STATES = ['terminated', 'failed', 'cancelled' ];
        const ACTIVE_EXECUTION_STATES = _.difference(EXECUTION_STATES, END_EXECUTION_STATES);

        return _.includes(ACTIVE_EXECUTION_STATES, this.props.item.status);
    }

    render () {
        let execution = this.props.item;

        if (this._isActive(execution)) {
            let activeExecutionStatus
                = this.props.showWorkflowId ? execution.workflow_id + ' ' + execution.status : execution.status;
            return (
                <div className="ui label">
                    <i className="spinner loading icon"></i>
                    {activeExecutionStatus}
                    <i className="delete icon link" onClick={() => this.props.onCancelExecution(execution)}></i>
                </div>
            )
        } else if (this.props.showInactive) {
            let inactiveExecutionStatus
                = this.props.showInactiveAsLink ? (<a href="javascript:void(0)">{execution.status}</a>) : execution.status;
            return (
                <div className="ui label">
                    {inactiveExecutionStatus}
                </div>
            )
        }
    }
}
