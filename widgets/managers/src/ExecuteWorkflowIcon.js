/**
 * Created by jakub.niezgoda on 30/10/2018.
 */

export default class ExecuteWorkflowIcon extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        onClick: PropTypes.func,
        workflows: PropTypes.array
    };

    static defaultProps = {
        onClick: _.noop,
        workflows: []
    };

    render() {
        const { WorkflowsMenu } = Stage.Common;

        return !_.isEmpty(this.props.workflows) ? (
            <WorkflowsMenu
                workflows={this.props.workflows}
                dropdownDirection="left"
                popupMenuProps={{ icon: 'cogs', help: 'Execute Workflow', bordered: true }}
                onClick={workflow => this.props.onClick(workflow)}
            />
        ) : null;
    }
}
