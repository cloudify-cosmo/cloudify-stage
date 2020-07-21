/**
 * Created by jakub.niezgoda on 30/10/2018.
 */

export default class ExecuteWorkflowIcon extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

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

ExecuteWorkflowIcon.propTypes = {
    onClick: PropTypes.func,
    workflows: PropTypes.arrayOf(PropTypes.object)
};

ExecuteWorkflowIcon.defaultProps = {
    onClick: _.noop,
    workflows: []
};
