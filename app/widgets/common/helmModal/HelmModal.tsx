import React, { useState } from 'react';
import type { Toolbox } from 'app/utils/StageAPI';
import { set } from 'lodash';
import type { PostHelmBlueprintRequestBody, PostHelmBlueprintResponse } from 'backend/routes/blueprints/Helm.types';
import type { ClusterCredentialName, ClusterCredentials } from 'backend/handler/HelmHandler.types';
import { ApproveButton, CancelButton, Form, LoadingOverlay, Modal } from '../../../components/basic';
import { useBoolean, useErrors, useInput } from '../../../utils/hooks';
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
const translateError = StageUtils.composeT(translate, 'errors');

const initialCredentials: ClusterCredentials = {
    host: { source: 'input', value: '' },
    api_key: { source: 'secret', value: '' },
    ssl_ca_cert: { source: 'secret', value: '' }
};

export default function HelmModal({ onHide, toolbox }: HelmModalProps) {
    const [repository, setRepository] = useInput('');
    const [chart, setChart] = useInput('');
    const [blueprintId, setBlueprintId] = useInput('');
    const [description, setDescription] = useInput('');

    const [credentials, setCredentials] = useState<ClusterCredentials>(initialCredentials);

    const [submitInProgress, startSubmit, stopSubmit] = useBoolean();
    const { performValidations, getContextError, errors } = useErrors<
        'repository' | 'blueprintId' | ClusterCredentialName
    >();

    function handleSubmit() {
        performValidations(validationErrors => {
            if (!repository) {
                validationErrors.repository = translateError('noRepositoryUrl');
            } else if (!Stage.Utils.Url.isUrl(repository)) {
                validationErrors.repository = translateError('invalidRepositoryUrl');
            }

            if (!blueprintId) {
                validationErrors.blueprintId = translateError('noBlueprintName');
            } else if (!blueprintId.match(Consts.idRegex)) {
                validationErrors.blueprintId = translateError('invalidBlueprintName');
            }

            function validateCredential(credentialName: ClusterCredentialName) {
                const credential = credentials[credentialName];
                if (!credential?.value) {
                    validationErrors[credentialName] = translateError(`${credential?.source}Missing`);
                }
            }

            validateCredential('host');
            validateCredential('api_key');
            validateCredential('ssl_ca_cert');
        }, performSubmit);
    }

    function performSubmit() {
        startSubmit();
        toolbox
            .getInternal()
            .doPost<PostHelmBlueprintResponse, PostHelmBlueprintRequestBody>('/helm/blueprint', {
                body: {
                    repository,
                    chart,
                    description,
                    clusterCredentials: credentials
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

    function renderClusterCredentialInput(clusterCredential: ClusterCredentialName) {
        return (
            <ClusterCredentialInput
                toolbox={toolbox}
                clusterCredential={clusterCredential}
                initialSource={initialCredentials[clusterCredential].source}
                onChange={changedClusterCredential =>
                    setCredentials({ ...credentials, [clusterCredential]: changedClusterCredential })
                }
                error={getContextError(clusterCredential)}
            />
        );
    }

    return (
        <Modal open onClose={onHide}>
            {submitInProgress && <LoadingOverlay />}
            <Modal.Header>{translate('header')}</Modal.Header>

            <Modal.Content>
                <Form errors={errors ? [] : undefined}>
                    <AccordionSection title={translate('mainSection.header')}>
                        <Form.Field
                            required
                            label={translate('mainSection.helmRepo')}
                            error={getContextError('repository')}
                        >
                            <Form.Input onChange={setRepository} />
                        </Form.Field>
                        <Form.Field label={translate('mainSection.helmChart')}>
                            <Form.Input onChange={setChart} />
                        </Form.Field>
                        <Form.Field
                            required
                            label={translate('mainSection.blueprintName')}
                            error={getContextError('blueprintId')}
                        >
                            <Form.Input onChange={setBlueprintId} />
                        </Form.Field>
                        <Form.Field label={translate('mainSection.blueprintDescription')}>
                            <Form.TextArea onChange={setDescription} />
                        </Form.Field>
                    </AccordionSection>
                    <AccordionSection title={translate('credentialsSection.header')}>
                        {renderClusterCredentialInput('host')}
                        {renderClusterCredentialInput('api_key')}
                        {renderClusterCredentialInput('ssl_ca_cert')}
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
