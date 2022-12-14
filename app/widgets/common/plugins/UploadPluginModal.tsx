// @ts-nocheck File not migrated fully to TS
import React from 'react';
import PropTypes from 'prop-types';
import Consts from '../Consts';
import ToolboxPropType from '../../../utils/props/Toolbox';
import PluginActions from './PluginActions';
import UploadPluginForm from './UploadPluginForm';

function UploadPluginModal({ open, onHide, toolbox }) {
    const { useResettableState, useBoolean, useErrors, useInputs, useOpenProp } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [visibility, setVisibility, clearVisibility] = useResettableState(Consts.defaultVisibility);
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

        const actions = new PluginActions(toolbox);
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
                <ApproveButton onClick={uploadPlugin} disabled={isLoading} content="Upload" icon="upload" />
            </Modal.Actions>
        </Modal>
    );
}

UploadPluginModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: ToolboxPropType.isRequired
};

export default UploadPluginModal;
