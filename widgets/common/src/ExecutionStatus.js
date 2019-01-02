/**
 * Created by jakubniezgoda on 27/01/2017.
 */

import PropTypes from 'prop-types';

class ExecutionStatus extends React.Component {

    constructor(props,context) {
        super(props,context);
    }

    static propTypes = {
        item: PropTypes.object.isRequired,
        labelProps: PropTypes.object,
        iconProps: PropTypes.object,
        allowShowingPopup: PropTypes.bool,
        showLabel: PropTypes.bool,
        showWorkflowId: PropTypes.bool
    };

    static defaultProps = {
        labelProps: {},
        iconProps: {},
        allowShowingPopup: true,
        showLabel: true,
        showWorkflowId: false
    };

    render () {
        let {Icon, Label, Popup} = Stage.Basic;
        let {ExecutionUtils} = Stage.Common;

        let execution = this.props.item;
        let executionStatusDisplay = execution.status_display || execution.status;
        const showPopup = this.props.allowShowingPopup && ExecutionUtils.isWaitingExecution(execution) && !_.isEmpty(execution.scheduled_for);

        return this.props.showLabel
            ?
            <Popup on={showPopup ? 'hover' : ''}>
                <Popup.Trigger>
                    <Label {...this.props.labelProps} onClick={(e) => e.stopPropagation()}>
                        <Icon {...ExecutionUtils.getExecutionStatusIconParams(execution)} {...this.props.iconProps} />
                        {this.props.showWorkflowId && execution.workflow_id}
                        {this.props.showWorkflowId && ' '}
                        {executionStatusDisplay}
                    </Label>
                </Popup.Trigger>
                {
                    showPopup
                        ? <span>Scheduled for: <strong>{execution.scheduled_for}</strong></span>
                        : null
                }
            </Popup>
            :
            <Icon {...ExecutionUtils.getExecutionStatusIconParams(execution)} {...this.props.iconProps}
                  onClick={(e) => e.stopPropagation()} />
    }
}

Stage.defineCommon({
    name: 'ExecutionStatus',
    common: ExecutionStatus
});