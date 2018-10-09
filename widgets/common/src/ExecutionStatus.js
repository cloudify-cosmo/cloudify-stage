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
        showLabel: PropTypes.bool,
        showWorkflowId: PropTypes.bool
    };

    static defaultProps = {
        labelProps: {},
        iconProps: {},
        showLabel: true,
        showWorkflowId: false
    };

    render () {
        let {Label, Icon} = Stage.Basic;
        let {ExecutionUtils} = Stage.Common;

        let execution = this.props.item;
        let executionStatusDisplay = execution.status_display || execution.status;

        return this.props.showLabel
            ?
            <Label {...this.props.labelProps} onClick={(e) => e.stopPropagation()}>
                <Icon {...ExecutionUtils.getExecutionStatusIconParams(execution)} {...this.props.iconProps} />
                {this.props.showWorkflowId && execution.workflow_id}
                {this.props.showWorkflowId && ' '}
                {executionStatusDisplay}
            </Label>
            :
            <Icon {...ExecutionUtils.getExecutionStatusIconParams(execution)} {...this.props.iconProps}
                  onClick={(e) => e.stopPropagation()} />
    }
}

Stage.defineCommon({
    name: 'ExecutionStatus',
    common: ExecutionStatus
});