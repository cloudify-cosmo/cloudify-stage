/**
 * Created by jakubniezgoda on 27/01/2017.
 */

let PropTypes = React.PropTypes;

const EXECUTION_CANCEL_ACTION = 'cancel';
const EXECUTION_FORCE_CANCEL_ACTION = 'force-cancel';

export default class ActiveExecutionStatus extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            cancelClicked: false
        }
    }

    static propTypes = {
        item: PropTypes.object.isRequired,
        onCancelExecution: PropTypes.func.isRequired
    };


    _onDropdownChange(event, data) {
        this.setState({cancelClicked: true});
        this.props.onCancelExecution(this.props.item, data.value);
    }

    render () {
        let {Dropdown, Label, Icon} = Stage.Basic;

        let execution = this.props.item;
        let activeExecutionStatus = execution.workflow_id + ' ' + execution.status;
        let cancelClicked = this.state.cancelClicked;
        let executionCancellationOptions = [
            {text: 'Cancel', value: EXECUTION_CANCEL_ACTION},
            {text: 'Force Cancel', value: EXECUTION_FORCE_CANCEL_ACTION}
        ];

        return (
            <Label>
                <Icon name="spinner" loading />
                {activeExecutionStatus}
                <Dropdown disabled={cancelClicked} icon='delete' text=' ' pointing="bottom right"
                          selectOnBlur={false} openOnFocus={false}
                          options={executionCancellationOptions} onChange={this._onDropdownChange.bind(this)} />
            </Label>
        )
    }
}
