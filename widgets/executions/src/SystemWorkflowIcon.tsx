import type { Execution } from 'app/utils/shared/ExecutionUtils';

export default function SystemWorkflowIcon({ execution }: { execution?: Execution }) {
    const { Icon, Popup } = Stage.Basic;

    return execution?.is_system_workflow ? (
        <Popup wide on="hover">
            <Popup.Trigger>
                <Icon name="cogs" color="blue" />
            </Popup.Trigger>
            <Popup.Content>System Workflow</Popup.Content>
        </Popup>
    ) : null;
}
