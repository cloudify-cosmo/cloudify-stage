/**
 * Created by jakub.niezgoda on 18/10/2018.
 */

export default function SystemWorkflowIcon({ execution }) {
    const { Icon, Popup } = Stage.Basic;

    return execution.is_system_workflow ? (
        <Popup wide on="hover">
            <Popup.Trigger>
                <Icon name="cogs" color="blue" />
            </Popup.Trigger>
            <Popup.Content>System Workflow</Popup.Content>
        </Popup>
    ) : null;
}

SystemWorkflowIcon.propTypes = {
    execution: PropTypes.shape({ is_system_workflow: PropTypes.bool })
};

SystemWorkflowIcon.defaultProps = {
    execution: { is_system_workflow: false }
};
