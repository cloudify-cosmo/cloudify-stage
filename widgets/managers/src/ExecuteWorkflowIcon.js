/**
 * Created by jakub.niezgoda on 30/10/2018.
 */

export default class ExecuteWorkflowIcon extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        onClick: PropTypes.func,
        workflows: PropTypes.arrayOf(PropTypes.shape({}))
    };

    static defaultProps = {
        onClick: _.noop,
        workflows: []
    };

    render() {
        const { onClick, workflows } = this.props;
        const { WorkflowsMenu } = Stage.Common;

        return !_.isEmpty(workflows) ? (
            <WorkflowsMenu
                workflows={workflows}
                dropdownDirection="left"
                popupMenuProps={{ icon: 'cogs', help: 'Execute Workflow', bordered: true }}
                onClick={workflow => onClick(workflow)}
            />
        ) : null;
    }
}
