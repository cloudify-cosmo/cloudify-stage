import type { Execution } from 'app/utils/shared/ExecutionUtils';

export default function DryRunIcon({ execution }: { execution?: Execution }) {
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
