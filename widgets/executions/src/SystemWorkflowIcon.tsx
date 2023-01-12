import type { Execution } from 'app/utils/shared/ExecutionUtils';

const translate = Stage.Utils.getT('widgets.executions');

export default function SystemWorkflowIcon({ execution }: { execution?: Execution }) {
    const { Icon, Popup } = Stage.Basic;

    return execution?.is_system_workflow ? (
        <Popup wide on="hover">
            <Popup.Trigger>
                <Icon name="cogs" color="blue" />
            </Popup.Trigger>
            <Popup.Content>{translate('systemWorkflow')}</Popup.Content>
        </Popup>
    ) : null;
}
