/**
 * Created by jakub.niezgoda on 30/10/2018.
 */

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

    handleClick(event, workflow) {
        this.props.onClick(workflow);
    }

    render () {
        let {Button, Popup, PopupMenu, Menu} = Stage.Basic;
        let managers = this.props.managers;

        return (
            <Popup on={_.isEmpty(managers) ? 'hover' : []}
                   open={_.isEmpty(managers) ? undefined : false}>
                <Popup.Trigger>
                    <div>
                        <PopupMenu className="workflowAction" offset={0}>
                            <Popup.Trigger>
                                <Button icon='cogs' content='Execute Workflow'
                                        labelPosition='left' disabled={_.isEmpty(managers)} />
                            </Popup.Trigger>

                            <Menu vertical>
                                {
                                    _.map(this.props.workflows, (workflow) =>
                                        <Menu.Item name={workflow.name} onClick={(event) => this.handleClick(event, workflow)}
                                                   key={workflow.name}>
                                            {_.capitalize(_.lowerCase(workflow.name))}
                                        </Menu.Item>
                                    )
                                }
                            </Menu>
                        </PopupMenu>
                    </div>
                </Popup.Trigger>

                <Popup.Content>
                    Tick at least one manager to perform bulk workflow execution
                </Popup.Content>
            </Popup>
        );
    }
}

