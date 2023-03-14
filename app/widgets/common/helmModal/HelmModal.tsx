import React from 'react';
import type { Toolbox } from 'app/utils/StageAPI';
import { set } from 'lodash';
import type { PostHelmBlueprintRequestBody, PostHelmBlueprintResponse } from 'backend/routes/blueprints/Helm.types';
import type { ClusterCredential } from 'backend/handler/HelmHandler.types';
import { ApproveButton, CancelButton, Form, LoadingOverlay, Modal } from '../../../components/basic';
import { useBoolean, useInput } from '../../../utils/hooks';
import AccordionSection from '../components/accordion/AccordionSection';
import ClusterCredentialInput from './ClusterCredentialInput';
import StageUtils from '../../../utils/stageUtils';
import BlueprintActions from '../blueprints/BlueprintActions';
import Consts from '../Consts';

interface HelmModalProps {
    onHide: () => void;
    toolbox: Toolbox;
}

const translate = StageUtils.getT('widgets.blueprints.helmModal');

export default function HelmModal({ onHide, toolbox }: HelmModalProps) {
    const [repository, setRepository] = useInput('');
    const [chart, setChart] = useInput('');
    const [blueprintId, setBlueprintId] = useInput('');
    const [description, setDescription] = useInput('');
    const [host, setHost] = useInput<ClusterCredential | undefined>(undefined);
    const [apiKey, setApiKey] = useInput<ClusterCredential | undefined>(undefined);
    const [certificate, setCertificate] = useInput<ClusterCredential | undefined>(undefined);
    const [submitInProgress, startSubmit, stopSubmit] = useBoolean();

    function handleSubmit() {
        startSubmit();
        return toolbox
            .getInternal()
            .doPost<PostHelmBlueprintResponse, PostHelmBlueprintRequestBody>('/helm/blueprint', {
                body: {
                    repository,
                    chart,
                    description,
                    clusterCredentials: { host: host!, api_key: apiKey!, ssl_ca_cert: certificate! }
                }
            })
            .then(blueprintContent => {
                const blueprintActions = new BlueprintActions(toolbox);
                const file = set<File>(new Blob([blueprintContent]), 'name', Consts.defaultBlueprintYamlFileName);

                return blueprintActions.doUpload(blueprintId, {
                    file,
                    blueprintYamlFile: Consts.defaultBlueprintYamlFileName
                });
            })
            .then(() =>
                toolbox.drillDown(
                    toolbox.getWidget(),
                    'blueprint',
                    {
                        blueprintId
                    },
                    blueprintId
                )
            )
            .catch(stopSubmit);
    }

    return (
        <Modal open onClose={onHide}>
            {submitInProgress && <LoadingOverlay />}
            <Modal.Header>{translate('header')}</Modal.Header>

            <Modal.Content>
                <Form>
                    <AccordionSection title={translate('mainSection.header')}>
                        <Form.Field label={translate('mainSection.helmRepo')}>
                            <Form.Input onChange={setRepository} />
                        </Form.Field>
                        <Form.Field label={translate('mainSection.helmChart')}>
                            <Form.Input onChange={setChart} />
                        </Form.Field>
                        <Form.Field label={translate('mainSection.blueprintName')}>
                            <Form.Input onChange={setBlueprintId} />
                        </Form.Field>
                        <Form.Field label={translate('mainSection.blueprintDescription')}>
                            <Form.TextArea onChange={setDescription} />
                        </Form.Field>
                    </AccordionSection>
                    <AccordionSection title={translate('credentialsSection.header')}>
                        <ClusterCredentialInput
                            toolbox={toolbox}
                            clusterCredential="host"
                            initialSource="input"
                            onChange={setHost}
                        />
                        <ClusterCredentialInput toolbox={toolbox} clusterCredential="api_key" onChange={setApiKey} />
                        <ClusterCredentialInput
                            toolbox={toolbox}
                            clusterCredential="ssl_ca_cert"
                            onChange={setCertificate}
                        />
                    </AccordionSection>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} />
                <ApproveButton onClick={handleSubmit} content={translate('submit')} />
            </Modal.Actions>
        </Modal>
    );
}
