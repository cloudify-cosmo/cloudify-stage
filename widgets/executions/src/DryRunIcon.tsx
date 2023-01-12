import type { Execution } from 'app/utils/shared/ExecutionUtils';

export default function DryRunIcon({ execution }: { execution?: Pick<Execution, 'is_dry_run'> }) {
    const { Icon, Popup } = Stage.Basic;

    return execution?.is_dry_run ? (
        <Popup wide on="hover">
            <Popup.Trigger>
                <Icon name="clipboard check" color="green" />
            </Popup.Trigger>
            <Popup.Content>Dry Run</Popup.Content>
        </Popup>
    ) : null;
}
