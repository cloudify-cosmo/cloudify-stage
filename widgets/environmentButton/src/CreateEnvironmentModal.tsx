import React, { useMemo, useState } from 'react';
import type { Toolbox } from 'app/utils/StageAPI';
import type {
    PostEnvironmentBlueprintRequestBody,
    PostEnvironmentBlueprintResponse
} from 'backend/routes/blueprints/Environment.types';
import { find, isEmpty, map, pick, set } from 'lodash';
import type { DefaultableLabel } from 'widgets/environmentButton/src/widget.types';
import CapabilityBlueprintDefaultInput from './CapabilityBlueprintDefaultInput';
import CapabilityValueInput from './CapabilityValueInput';
import { blueprintDefaultHighlightSemanticColor } from './widget.consts';
import BlueprintDefaultFormField from './BlueprintDefaultFormField';

const translate = Stage.Utils.getT('widgets.environmentButton.createNewModal');
const translateForm = Stage.Utils.composeT(translate, 'form');
const translateCapabilities = Stage.Utils.composeT(translateForm, 'capabilities');
const translateSource = Stage.Utils.composeT(translateCapabilities, 'sources');
const translateError = Stage.Utils.composeT(translate, 'errors');

type Capability = PostEnvironmentBlueprintRequestBody['capabilities'][number];

interface CreateEnvironmentModalProps {
    onHide: () => void;
    toolbox: Toolbox;
}

const commonMaxLength = 256;

export default function CreateEnvironmentModal({ onHide, toolbox }: CreateEnvironmentModalProps) {
    const { ApproveButton, CancelButton, Form, GenericField, Modal, Header, LoadingOverlay, Confirm } = Stage.Basic;
    const { useInput, useBoolean, useErrors } = Stage.Hooks;
    const [submitInProgress, startSubmit, stopSubmit] = useBoolean();
    const { errors, setErrors, getContextError, performValidations } = useErrors<
        'name' | 'blueprintName' | 'capabilities'
    >();

    const capabilitiesColumns = useMemo<Stage.Types.WidgetConfigurationDefinition[]>(
        () => [
            {
                id: 'name',
                label: translateCapabilities('name'),
                type: GenericField.STRING_TYPE,
                maxLength: commonMaxLength
            },
            {
                id: 'source',
                label: translateCapabilities('source'),
                type: GenericField.LIST_TYPE,
                items: ['static', 'secret', 'input'].map(value => ({ value, name: translateSource(value) })),
                width: 3
            },
            {
                id: 'blueprintDefault',
                label: translateCapabilities('default'),
                type: GenericField.CUSTOM_TYPE,
                component: CapabilityBlueprintDefaultInput,
                width: 1,
                style: { textAlign: 'center', paddingBottom: 16 }
            },
            {
                id: 'value',
                label: translateCapabilities('value'),
                type: GenericField.CUSTOM_TYPE,
                component: CapabilityValueInput,
                width: 4
            }
        ],
        undefined
    );

    const [deploymentName, setDeploymentName] = useInput('');
    const [blueprintName, setBlueprintName] = useInput('');
    const [blueprintDescription, setBlueprintDescription] = useInput('');
    const [capabilities, setCapabilities] = useState<Capability[]>([]);
    const [siteName, setSiteName] = useState<string | null>(null);
    const [labels, setLabels] = useInput<DefaultableLabel[]>([]);
    const [generatingBlueprintName, showGeneratingBluepringName, hideGeneratingBlueprintName] = useBoolean();
    const [confirmCancelModalOpen, openConfirmCancelModal, closeConfirmCancelModal] = useBoolean();

    const { Consts } = Stage.Common;

    function handleSubmit() {
        performValidations(validationErrors => {
            if (!blueprintName) {
                validationErrors.blueprintName = translateError('blueprintNameMissing');
            } else if (!blueprintName.match(Consts.idRegex)) {
                validationErrors.blueprintName = translateError('blueprintNameInvalid');
            }

            if (!deploymentName) {
                validationErrors.name = translateError('nameMissing');
            }

            capabilities.forEach((capability, index) => {
                function getErrorsForRow() {
                    validationErrors.capabilities = validationErrors.capabilities ?? {};
                    validationErrors.capabilities[index] = validationErrors.capabilities[index] ?? {};
                    return validationErrors.capabilities[index];
                }

                if (!capability.name) {
                    getErrorsForRow().name = translateError('capabilityNameMissing');
                } else if (find(capabilities.slice(0, index), pick(capability, 'name'))) {
                    getErrorsForRow().name = translateError('capabilityNameDuplicated');
                }

                if (!capability.source) {
                    getErrorsForRow().source = translateError('capabilitySourceMissing');
                }
            });
        }, performSubmit);
    }

    function performSubmit() {
        startSubmit();

        const blueprintActions = new Stage.Common.Blueprints.Actions(toolbox);

        blueprintActions
            .doGetBlueprints({ id: blueprintName })
            .then(response => {
                if (response.items.length) {
                    setErrors({ blueprintName: translateError('blueprintNameExists') });
                    return Promise.resolve();
                }

                const creationParams: PostEnvironmentBlueprintRequestBody = {
                    description: blueprintDescription,
                    labels,
                    capabilities
                };

                return toolbox
                    .getInternal()
                    .doPost<PostEnvironmentBlueprintResponse, PostEnvironmentBlueprintRequestBody>(
                        '/environment/blueprint',
                        {
                            body: creationParams
                        }
                    )
                    .then(blueprintContent => {
                        const file = set<File>(
                            new Blob([blueprintContent]),
                            'name',
                            Consts.defaultBlueprintYamlFileName
                        );

                        return blueprintActions.doUpload(blueprintName, {
                            file,
                            blueprintYamlFile: Consts.defaultBlueprintYamlFileName
                        });
                    })
                    .then(() =>
                        toolbox.drillDown(
                            toolbox.getWidget(),
                            'blueprint',
                            {
                                blueprintId: blueprintName,
                                deploymentName,
                                deploymentInputs: _(
                                    capabilities.filter(
                                        capability => capability.source !== 'static' && !capability.blueprintDefault
                                    )
                                )
                                    .keyBy('name')
                                    .mapValues(capability => `{ get-${capability.source}: ${capability.value} }`)
                                    .value(),
                                labels: labels.filter(label => !label.blueprintDefault),
                                siteName,
                                openDeploymentModal: true
                            },
                            blueprintName
                        )
                    );
            })
            .finally(stopSubmit);
    }

    function handleNameBlur() {
        const SearchAction = Stage.Common.Actions.Search;

        if (deploymentName && !blueprintName) {
            showGeneratingBluepringName();
            new SearchAction(toolbox)
                .doListBlueprints([], { _include: 'id', _search: deploymentName })
                .then(existingBlueprints => {
                    const existingBlueprintIds = map(existingBlueprints.items, 'id');
                    const newBlueprintName = deploymentName.toLowerCase().replaceAll(/\s+/g, '_');
                    if (!existingBlueprintIds.includes(newBlueprintName)) {
                        setBlueprintName(newBlueprintName);
                    } else {
                        let suffix = 1;
                        while (existingBlueprintIds.includes(`${newBlueprintName}_${suffix}`)) {
                            suffix += 1;
                        }
                        setBlueprintName(`${newBlueprintName}_${suffix}`);
                    }
                })
                .finally(hideGeneratingBlueprintName);
        }
    }

    const { DynamicTable } = Stage.Shared;
    const { DynamicDropdown } = Stage.Common.Components;
    const LabelsInput = Stage.Common.Labels.Input;

    return (
        <>
            <Modal open onClose={onHide}>
                {submitInProgress && <LoadingOverlay />}
                <Modal.Header>{translate('header')}</Modal.Header>
                <Modal.Content>
                    <Form scrollToError errors={isEmpty(errors) ? undefined : {}}>
                        <Form.Input
                            label={translateForm(`name`)}
                            value={deploymentName}
                            onChange={setDeploymentName}
                            onBlur={handleNameBlur}
                            error={getContextError('name')}
                            required
                        >
                            <input maxLength={commonMaxLength} />
                        </Form.Input>
                        <Form.Input
                            label={translateForm(`blueprintName`)}
                            value={blueprintName}
                            onChange={setBlueprintName}
                            loading={generatingBlueprintName}
                            required
                            error={getContextError('blueprintName')}
                        />
                        <Form.TextArea
                            label={translateForm(`blueprintDescription`)}
                            name="blueprintDescription"
                            value={blueprintDescription}
                            onChange={setBlueprintDescription}
                        />
                        <Header size="tiny">{translateCapabilities('header')}</Header>
                        <DynamicTable
                            name=""
                            value={capabilities}
                            onChange={(_event, field) => setCapabilities(field.value as Capability[])}
                            columns={capabilitiesColumns}
                            widgetlessToolbox={toolbox}
                            errors={errors.capabilities}
                        />
                        <Header size="tiny">{translateForm('labels.header')}</Header>
                        <LabelsInput
                            toolbox={toolbox}
                            onChange={setLabels}
                            extraFormField={BlueprintDefaultFormField}
                            coloringStrategy={label =>
                                label.blueprintDefault ? blueprintDefaultHighlightSemanticColor : undefined
                            }
                        />
                        <Header size="tiny">{translateForm('location')}</Header>
                        <DynamicDropdown
                            value={siteName}
                            onChange={value => typeof value === 'string' && setSiteName(value)}
                            fetchUrl="/sites?_include=name"
                            valueProp="name"
                            toolbox={toolbox}
                        />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <CancelButton onClick={openConfirmCancelModal} />
                    <ApproveButton onClick={handleSubmit} content={translate('submit')} />
                </Modal.Actions>
            </Modal>
            <Confirm
                open={confirmCancelModalOpen}
                content={translate('cancelConfirm')}
                onConfirm={onHide}
                onCancel={closeConfirmCancelModal}
            />
        </>
    );
}
