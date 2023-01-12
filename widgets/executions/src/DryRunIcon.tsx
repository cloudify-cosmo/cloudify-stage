import type { Execution } from 'app/utils/shared/ExecutionUtils';

const translate = Stage.Utils.getT('widgets.executions');

export default function DryRunIcon({ execution }: { execution?: Execution }) {
    const { Icon, Popup } = Stage.Basic;

    return execution?.is_dry_run ? (
        <Popup wide on="hover">
            <Popup.Trigger>
                <Icon name="clipboard check" color="green" />
            </Popup.Trigger>
            <Popup.Content>{translate('dryRun')}</Popup.Content>
        </Popup>
    ) : null;
}
