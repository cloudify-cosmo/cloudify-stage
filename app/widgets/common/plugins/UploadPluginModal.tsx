import React from 'react';
import Consts from '../Consts';
import PluginActions from './PluginActions';
import UploadPluginForm from './UploadPluginForm';
import type { Resources, ResourceName } from './PluginActions';
import type { UploadPluginFormProps } from './UploadPluginForm';
import type { Visibility } from '../types';

interface UploadPluginModalProps {
    open: boolean;
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
}

function UploadPluginModal({ open, onHide, toolbox }: UploadPluginModalProps) {
    const { useResettableState, useBoolean, useErrors, useInputs, useOpenProp } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setErrors, clearErrors, setMessageAsError } = useErrors();
    const [visibility, setVisibility, clearVisibility] = useResettableState<Visibility>(Consts.defaultVisibility);
    const [inputs, setInputs, clearInputs] = useInputs({
        title: '',
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

        const validationErrors: Record<string, string> = {};

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

        const createUploadResource = (name: ResourceName): Resources => {
            type AvailableInputName = keyof typeof inputs;
            const urlInputName: AvailableInputName = `${name}Url`;
            const fileInputName: AvailableInputName = `${name}File`;

            const { [urlInputName]: url, [fileInputName]: file } = inputs;

            return {
                [name]: { url, file }
            } as Resources;
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

    const onFormFieldChange: UploadPluginFormProps['onChange'] = values => {
        setInputs(values);
    };

    const { ApproveButton, CancelButton, Form, Icon, Modal, VisibilityField } = Stage.Basic;

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="upload" /> Upload plugin
                <VisibilityField visibility={visibility} className="rightFloated" onVisibilityChange={setVisibility} />
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} onErrorsDismiss={clearErrors} loading={isLoading}>
                    <UploadPluginForm errors={errors} onChange={onFormFieldChange} toolbox={toolbox} />
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton onClick={uploadPlugin} disabled={isLoading} content="Upload" icon="upload" />
            </Modal.Actions>
        </Modal>
    );
}

export default UploadPluginModal;
