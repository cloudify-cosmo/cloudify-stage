/**
 * Created by jakub.niezgoda on 18/10/2018.
 */

export default function DryRunIcon({ execution }) {
    const { Icon, Popup } = Stage.Basic;

    return execution.is_dry_run ? (
        <Popup wide on="hover">
            <Popup.Trigger>
                <Icon name="clipboard check" color="green" />
            </Popup.Trigger>
            <Popup.Content>Dry Run</Popup.Content>
        </Popup>
    ) : null;
}

DryRunIcon.propTypes = {
    execution: PropTypes.shape({ is_dry_run: PropTypes.bool })
};

DryRunIcon.defaultProps = {
    execution: { is_dry_run: false }
};
