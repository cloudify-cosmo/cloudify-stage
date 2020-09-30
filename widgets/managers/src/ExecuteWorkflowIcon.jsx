/**
 * Created by jakub.niezgoda on 30/10/2018.
 */

export default function ExecuteWorkflowIcon({ onClick, workflows }) {
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

ExecuteWorkflowIcon.propTypes = {
    onClick: PropTypes.func,
    workflows: PropTypes.arrayOf(PropTypes.object)
};

ExecuteWorkflowIcon.defaultProps = {
    onClick: _.noop,
    workflows: []
};
