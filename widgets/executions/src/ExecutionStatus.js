/**
 * Created by jakubniezgoda on 27/01/2017.
 */

import { Constants, isActiveExecution } from './utils';

let PropTypes = React.PropTypes;

export default class extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            cancelClicked: false
        }
    }

    static propTypes = {
        item: PropTypes.object.isRequired,
        onCancelExecution: PropTypes.func.isRequired,
        showInactiveAsLink: PropTypes.bool.isRequired
    };

    _onDropdownChange(event, data) {
        this.setState({cancelClicked: true});
        this.props.onCancelExecution(this.props.item, data.value === Constants.EXECUTION_FORCE_CANCEL_ACTION);
    }

    render () {
        let {Dropdown, Label, Icon} = Stage.Basic;

        let execution = this.props.item;

        if (isActiveExecution(execution)) {
            let activeExecutionStatus = execution.status;
            let cancelClicked = this.state.cancelClicked;
            let executionCancellationOptions = [
                {text: 'Cancel', value: Constants.EXECUTION_CANCEL_ACTION},
                {text: 'Force Cancel', value: Constants.EXECUTION_FORCE_CANCEL_ACTION}
            ];

            return (
                <Label>
                    <Icon name="spinner" loading />
                    {activeExecutionStatus}
                    <Dropdown disabled={cancelClicked} icon='delete' text=' '
                              options={executionCancellationOptions} onChange={this._onDropdownChange.bind(this)} />
                </Label>
            )
        } else {
            let inactiveExecutionStatus
                = this.props.showInactiveAsLink ? (<a href="javascript:void(0)">{execution.status}</a>) : execution.status;
            return (
                <Label>{inactiveExecutionStatus}</Label>
            )
        }
    }
}
