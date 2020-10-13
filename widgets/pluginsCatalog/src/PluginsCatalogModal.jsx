export default function PluginsCatalogModal({ actions, onSuccess, onHide, open, plugin, toolbox }) {
    const { useBoolean, useOpenProp, useInput } = Stage.Hooks;
    const { useState } = React;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [error, setError] = useState();
    const [visibility, setVisibility, clearVisibility] = useInput(Stage.Common.Consts.defaultVisibility);
    useOpenProp(open, () => {
        unsetLoading();
        setError(null);
        clearVisibility();
    });

    function onApprove() {
        setLoading();

        actions
            .doUpload(plugin, visibility)
            .then(() => {
                toolbox.getEventBus().trigger('plugins:refresh');
                onHide();
                onSuccess(`${plugin.title} successfully uploaded`);
            })
            .catch(err => setError(err.message))
            .finally(unsetLoading);
        return false;
    }

    const { Modal, CancelButton, ApproveButton, Icon, ErrorMessage, VisibilityField } = Stage.Basic;

    return (
        <div>
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="upload" /> Upload Plugin
                    <VisibilityField
                        visibility={visibility}
                        className="rightFloated"
                        onVisibilityChange={setVisibility}
                    />
                </Modal.Header>

                <Modal.Content>
                    <ErrorMessage error={error} onDismiss={() => setError(null)} />
                    Are you sure you want to upload the plugin <b>{plugin && plugin.title}</b>?
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onHide} disabled={isLoading} />
                    <ApproveButton
                        onClick={onApprove}
                        disabled={isLoading}
                        loading={isLoading}
                        content="Upload"
                        icon="upload"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        </div>
    );
}

PluginsCatalogModal.propTypes = {
    actions: PropTypes.shape({
        doUpload: PropTypes.func
    }).isRequired,
    onHide: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    plugin: PropTypes.shape({ title: PropTypes.string }),
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

PluginsCatalogModal.defaultProps = {
    plugin: null
};
