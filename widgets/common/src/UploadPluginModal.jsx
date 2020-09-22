/**
 * Created by kinneretzin on 05/10/2016.
 */

function UploadPluginModal({ open, onHide, toolbox }) {
    const { useResetableState, useBoolean, useErrors, useInputs, useOpenProp } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [visibility, setVisibility, clearVisibility] = useResetableState(Stage.Common.Consts.defaultVisibility);
    const [inputs, setInputs, clearInputs] = useInputs({
        wagonUrl: '',
        wagonFile: null,
        yamlUrl: '',
        yamlFile: null,
        iconUrl: '',
        iconFile: null
    });

    useOpenProp(open, () => {
        unsetLoading();
        clearErrors();
        clearVisibility();
        clearInputs();
    });

    function uploadPlugin() {
        const { wagonUrl, yamlUrl, iconUrl, iconFile, title, wagonFile, yamlFile } = inputs;

        const validationErrors = {};

        if (!wagonFile) {
            if (_.isEmpty(wagonUrl)) {
                validationErrors.wagonUrl = 'Please select wagon file or provide URL to wagon file';
            } else if (!Stage.Utils.Url.isUrl(wagonUrl)) {
                validationErrors.wagonUrl = 'Please provide valid URL for wagon file';
            }
        }

        if (!yamlFile) {
            if (_.isEmpty(yamlUrl)) {
                validationErrors.yamlUrl = 'Please select YAML file or provide URL to YAML file';
            } else if (!Stage.Utils.Url.isUrl(yamlUrl)) {
                validationErrors.yamlUrl = 'Please provide valid URL for YAML file';
            }
        }

        if (!title) {
            validationErrors.title = 'Please provide plugin title';
        }

        if (!iconFile && !_.isEmpty(iconUrl) && !Stage.Utils.Url.isUrl(iconUrl)) {
            validationErrors.iconUrl = 'Please provide valid URL for icon file';
        }

        if (!_.isEmpty(validationErrors)) {
            setErrors(validationErrors);
            return;
        }

        // Disable the form
        setLoading();

        const createUploadResource = name => {
            const { [`${name}Url`]: url, [`${name}File`]: file } = inputs;
            return {
                [name]: { url, file }
            };
        };

        const actions = new Stage.Common.PluginActions(toolbox);
        actions
            .doUpload(visibility, title, {
                ...createUploadResource('wagon'),
                ...createUploadResource('yaml'),
                ...createUploadResource('icon')
            })
            .then(() => {
                clearErrors();
                onHide();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function onFormFieldChange(values) {
        setInputs(values);
    }

    const { iconUrl, wagonUrl, yamlUrl } = inputs;
    const { ApproveButton, CancelButton, Form, Icon, Modal, VisibilityField } = Stage.Basic;
    const { UploadPluginForm } = Stage.Common;

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="upload" /> Upload plugin
                <VisibilityField visibility={visibility} className="rightFloated" onVisibilityChange={setVisibility} />
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors} loading={isLoading}>
                    <UploadPluginForm
                        wagonUrl={wagonUrl}
                        yamlUrl={yamlUrl}
                        iconUrl={iconUrl}
                        errors={errors}
                        onChange={onFormFieldChange}
                        toolbox={toolbox}
                    />
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton
                    onClick={uploadPlugin}
                    disabled={isLoading}
                    content="Upload"
                    icon="upload"
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
}

UploadPluginModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

Stage.defineCommon({
    name: 'UploadPluginModal',
    common: React.memo(UploadPluginModal, _.isEqual)
});
