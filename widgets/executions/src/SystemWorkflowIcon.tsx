import type { Execution } from 'app/utils/shared/ExecutionUtils';
import { translate } from './widget';

export default function SystemWorkflowIcon({ execution }: { execution?: Pick<Execution, 'is_system_workflow'> }) {
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
