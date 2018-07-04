/**
 * Created by jakubniezgoda on 27/01/2017.
 */

import PropTypes from 'prop-types';

export default class ExecutionStatus extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            cancelClicked: false
        }
    }

    static propTypes = {
        item: PropTypes.object.isRequired,
        onCancelExecution: PropTypes.func.isRequired,
        showInactiveAsLink: PropTypes.bool
    };

    _actionClick(event, {name}) {
        this.setState({cancelClicked: true});
        this.props.onCancelExecution(this.props.item, name);
    }

    render () {
        let {PopupMenu, Menu, Label, Icon} = Stage.Basic;
        let {ExecutionUtils} = Stage.Common;

        let execution = this.props.item;
        let executionStatusDisplay = execution.status_display || execution.status;

        if (ExecutionUtils.isActiveExecution(execution)) {
            let cancelClicked = this.state.cancelClicked;

            return (
                <Label>
                    <Icon name="spinner" loading />
                    {executionStatusDisplay}
                    <PopupMenu disabled={cancelClicked} icon='delete' >
                        <Menu pointing vertical>
                            <Menu.Item content='Cancel' name={ExecutionUtils.CANCEL_ACTION}
                                       onClick={this._actionClick.bind(this)} />
                            <Menu.Item content='Force Cancel' name={ExecutionUtils.FORCE_CANCEL_ACTION}
                                       onClick={this._actionClick.bind(this)} />
                            <Menu.Item content='Kill' name={ExecutionUtils.KILL_CANCEL_ACTION}
                                       onClick={this._actionClick.bind(this)} />
                        </Menu>
                    </PopupMenu>
                </Label>
            )
        } else {
            let inactiveExecutionStatus
                = this.props.showInactiveAsLink ? (<a href="javascript:void(0)">{executionStatusDisplay}</a>) : executionStatusDisplay;
            return (
                <Label>{inactiveExecutionStatus}</Label>
            )
        }
    }
}

Stage.defineCommon({
    name: 'ExecutionStatus',
    common: ExecutionStatus
});