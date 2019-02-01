/**
 * Created by jakub.niezgoda on 30/10/2018.
 */

import PropTypes from 'prop-types';

export default class ExecuteWorkflowButton extends React.Component {

    constructor(props, context){
        super(props, context);
    }

    static propTypes = {
        onClick: PropTypes.func,
        managers: PropTypes.array,
        workflows: PropTypes.array
    };

    static defaultProps = {
        onClick: _.noop,
        managers: [],
        workflows: [],
    };

    render () {
        let {Button, Popup} = Stage.Basic;
        let {WorkflowsMenu} = Stage.Common;
        let managers = this.props.managers;

        return (
            <Popup on={_.isEmpty(managers) ? 'hover' : []}
                   open={_.isEmpty(managers) ? undefined : false}>
                <Popup.Trigger>
                    <div>
                        <WorkflowsMenu workflows={this.props.workflows} dropdownDirection='left'
                                       trigger={<Button icon='cogs' content='Execute Workflow' labelPosition='left' disabled={_.isEmpty(managers)} />}
                                       onClick={(workflow) => this.props.onClick(workflow)}
                        />
                    </div>
                </Popup.Trigger>

                <Popup.Content>
                    Tick at least one manager to perform bulk workflow execution
                </Popup.Content>
            </Popup>
        );
    }
}

