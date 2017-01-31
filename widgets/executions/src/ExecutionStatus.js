/**
 * Created by jakubniezgoda on 27/01/2017.
 */

import { isActiveExecution } from './utils';

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
        this.props.onCancelExecution(this.props.item, data.value === 'force-cancel');
    }

    render () {
        let Dropdown = Stage.Basic.Dropdown;
        let Label = Stage.Basic.Label;
        let Icon = Stage.Basic.Icon;

        let execution = this.props.item;

        if (isActiveExecution(execution)) {
            let activeExecutionStatus = execution.status;
            let cancelClicked = this.state.cancelClicked;
            let executionCancellationOptions = [{text: 'Cancel', value: 'cancel'}, {text: 'Force Cancel', value: 'force-cancel'}];

            return (
                <Label>
                    <Icon name="spinner" loading />
                    {activeExecutionStatus}
                    <Dropdown disabled={cancelClicked} icon={<Icon name='delete' />} text=' '
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
