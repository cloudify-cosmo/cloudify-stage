// eslint-disable-next-line max-classes-per-file
import i18n from 'i18next';
import type { GetExternalContentQueryParams } from 'backend/routes/External.types';
import type { PutSourceListYamlQueryParams, PutSourceListYamlResponse } from 'backend/routes/SourceBrowser.types';
import Consts from '../Consts';
import DeploymentActions from '../deployments/DeploymentActions';
import type { Label } from '../labels/types';
import PollHelper from '../utils/PollHelper';
import StageUtils from '../../../utils/stageUtils';
import generateUploadFormData from './generateUploadFormData';

class BlueprintUploadError extends Error {
    constructor(message: string | null, public state: string) {
        super(message ?? '');
    }
}

type BlueprintSecret = string | Record<string, unknown>;

export interface BlueprintRequirements {
    /* eslint-disable-next-line camelcase */
    parent_capabilities: string[];
    secrets: BlueprintSecret[];
}

/* eslint-disable camelcase */
export interface Relationship {
    type: string;
    type_hierarchy: unknown[];
    target_id?: unknown;
}

export interface Node {
    id: string;
    type: string;
    type_hierarchy: unknown[];
    relationships?: Relationship[];
    actual_planned_number_of_instances?: unknown;
    actual_number_of_instances?: unknown;
    plugins?: unknown;
    capabilities?: unknown;
}

export interface BlueprintPlan {
    description: null | unknown;
    metadata: null | unknown;
    nodes: Node[];
    relationships: { [key: string]: unknown };
    workflows: { [key: string]: unknown };
    policy_types: { [key: string]: unknown };
    policy_triggers: { [key: string]: unknown };
    policies: { [key: string]: unknown };
    groups: { [key: string]: unknown };
    scaling_groups: { [key: string]: unknown };
    inputs: { [key: string]: unknown };
    outputs: { [key: string]: unknown };
    deployment_plugins_to_install: unknown[];
    workflow_plugins_to_install: unknown[];
    host_agent_plugins_to_install: unknown[];
    version: {
        raw: string;
        definitions_name: string;
        definitions_version: number[];
    };
    capabilities: { [key: string]: unknown };
    imported_blueprints: unknown[];
    namespaces_mapping: { [key: string]: unknown };
    data_types: {
        derived_from: string;
        version: string;
        properties: {
            description: string;
            type: string;
            default: unknown;
            required: boolean;
        };
    };
    labels: { [key: string]: unknown };
    blueprint_labels: { [key: string]: unknown };
    deployment_settings: { [key: string]: unknown };
}

export interface FullBlueprintData {
    id: string;
    visibility: string;
    created_at: string;
    main_file_name: string;
    plan: BlueprintPlan;
    updated_at: string;
    description: null | unknown;
    is_hidden: boolean;
    state: string;
    error: null | string;
    error_traceback: null | unknown;
    tenant_name: string;
    created_by: string;
    resource_availability: string;
    private_resource: false;
    labels: [];
    upload_execution: {
        visibility: string;
        created_at: string;
        id: string;
        ended_at: string;
        error: string;
        is_system_workflow: false;
        parameters: {
            blueprint_id: string;
            app_file_name: string;
            url: null | unknown;
            file_server_root: string;
            validate_only: false;
            labels: null | unknown;
        };
        status: string;
        workflow_id: string;
        started_at: string;
        scheduled_for: null | unknown;
        is_dry_run: false;
        resume: false;
        total_operations: number;
        finished_operations: number;
        allow_custom_parameters: true;
        blueprint_id: null | unknown;
        execution_group_id: string;
        deployment_display_name: null | unknown;
        deployment_id: null | unknown;
        status_display: string;
        tenant_name: string;
        created_by: string;
        resource_availability: string;
        private_resource: false;
    };
    requirements: null | BlueprintRequirements;
}
/* eslint-enable camelcase */

export interface BlueprintDeployParams {
    blueprintId: string;
    deploymentId: string;
    deploymentName: string;
    inputs: Record<string, any>;
    visibility: string;
    labels: Label[];
    skipPluginsValidation?: boolean;
    siteName?: string;
    runtimeOnlyEvaluation?: boolean;
}

export interface BlueprintUploadParameters {
    /* eslint-disable camelcase */
    application_file_name?: string;
    blueprint_archive_url?: string;
    visibility?: string;
    async_upload?: boolean;
    /* eslint-enable camelcase */
}

export const InProgressBlueprintStates = {
    Pending: 'pending',
    Uploading: 'uploading',
    Extracting: 'extracting',
    Parsing: 'parsing',
    UploadingImage: 'uploading_image'
};

export const CompletedBlueprintStates = {
    Uploaded: 'uploaded',
    FailedUploading: 'failed_uploading',
    FailedExtracting: 'failed_extracting',
    FailedParsing: 'failed_parsing',
    Invalid: 'invalid'
};

export default class BlueprintActions {
    static isUploaded(blueprint: { state: string }) {
        return blueprint.state === CompletedBlueprintStates.Uploaded;
    }

    static isCompleted(blueprint: { state: string }) {
        return Object.values(CompletedBlueprintStates).includes(blueprint.state);
    }

    constructor(private toolbox: Stage.Types.WidgetlessToolbox) {}

    doEditInComposer(blueprintId: string, mainFileName: string) {
        window.open(
            `/composer/import/${this.toolbox.getManager().getSelectedTenant()}/${blueprintId}/${mainFileName}`,
            '_blank'
        );
    }

    doGetBlueprints(params: Record<string, any>) {
        const { _include, ...restParams } = params;
        const include = ['id', _include].filter(val => !!val).join(',');

        return this.toolbox.getManager().doGet('/blueprints', { params: { _include: include, ...restParams } });
    }

    doGetUploadedBlueprints(params?: Record<string, any>) {
        return this.doGetBlueprints({
            _include: 'state',
            state: CompletedBlueprintStates.Uploaded,
            ...params
        });
    }

    doGetFullBlueprintData(blueprintId: string): Promise<FullBlueprintData> {
        return this.toolbox.getManager().doGet(`/blueprints/${blueprintId}`);
    }

    doDelete(blueprintId: string, force = false) {
        return this.toolbox.getManager().doDelete(`/blueprints/${blueprintId}`, { params: { force } });
    }

    doDeploy({
        blueprintId,
        deploymentId,
        deploymentName,
        inputs,
        visibility,
        labels = [],
        skipPluginsValidation = false,
        siteName,
        runtimeOnlyEvaluation = false
    }: BlueprintDeployParams) {
        const body: Record<string, any> = {
            blueprint_id: blueprintId,
            display_name: deploymentName,
            inputs,
            visibility,
            labels: DeploymentActions.toManagerLabels(labels),
            skip_plugins_validation: skipPluginsValidation,
            runtime_only_evaluation: runtimeOnlyEvaluation
        };

        if (siteName) {
            body.site_name = siteName;
        }

        return this.toolbox
            .getManager()
            .doPut(`/deployments/${deploymentId}`, { body })
            .catch(err =>
                Promise.reject(
                    err.code === 'deployment_plugin_not_found'
                        ? {
                              ...err,
                              message: `${err.message}. Install the plugin or use "Skip plugins validation" option.`
                          }
                        : err
                )
            );
    }

    async doUpload(
        blueprintName: string,
        {
            blueprintYamlFile,
            blueprintUrl,
            file,
            imageUrl,
            image,
            visibility = Consts.defaultVisibility,
            onStateChanged = _.noop
        }: {
            blueprintYamlFile?: string;
            blueprintUrl?: string;
            file?: Blob & { name: string };
            imageUrl?: string;
            image?: Blob;
            visibility?: string;
            onStateChanged?: (state: string) => void;
        }
    ) {
        const params: BlueprintUploadParameters = {
            visibility,
            async_upload: true
        };

        if (!_.isEmpty(blueprintYamlFile)) {
            params.application_file_name = blueprintYamlFile;
        }
        if (!_.isEmpty(blueprintUrl)) {
            params.blueprint_archive_url = blueprintUrl;
        }

        let imageFile = image;
        if (imageUrl) {
            try {
                imageFile = await (
                    await this.toolbox
                        .getInternal()
                        .doGet<Response, GetExternalContentQueryParams>('/external/content', {
                            params: { url: imageUrl },
                            parseResponse: false
                        })
                ).blob();
            } catch (error) {
                throw new Error(i18n.t('widgets.common.blueprintUpload.validationErrors.invalidImageUrl'));
            }
        }

        if (file) {
            const compressFile = StageUtils.isYamlFile(file.name);
            await this.toolbox.getManager().doUpload(`/blueprints/${blueprintName}`, {
                files: file,
                parseResponse: false,
                compressFile,
                onFileUpload: blueprintFile => {
                    const formData = generateUploadFormData(params, blueprintFile);
                    return formData;
                }
            });
        } else {
            const formData = generateUploadFormData(params);

            await this.toolbox.getManager().doPut(`/blueprints/${blueprintName}`, {
                body: formData
            });
        }

        await this.waitUntilUploaded(blueprintName, onStateChanged);
        await onStateChanged(InProgressBlueprintStates.UploadingImage);
        return this.doUploadImage(blueprintName, imageFile);
    }

    async waitUntilUploaded(blueprintName: string, onStateChanged: (state: string) => void) {
        const pollHelper = new PollHelper(60);

        let previousState = InProgressBlueprintStates.Pending;
        for (;;) {
            // eslint-disable-next-line no-await-in-loop
            await pollHelper.wait();

            // eslint-disable-next-line no-await-in-loop
            const blueprint = await this.doGetFullBlueprintData(blueprintName);

            if (BlueprintActions.isUploaded(blueprint)) {
                return;
            }

            if (BlueprintActions.isCompleted(blueprint)) {
                throw new BlueprintUploadError(blueprint.error, blueprint.state);
            }

            if (blueprint.state !== previousState) {
                pollHelper.resetAttempts();
                onStateChanged(blueprint.state);
                previousState = blueprint.state;
            }
        }
    }

    doSetVisibility(blueprintId: string, visibility: string) {
        return this.toolbox.getManager().doPatch(`/blueprints/${blueprintId}/set-visibility`, { body: { visibility } });
    }

    doListYamlFiles(blueprintUrl: string, file: File | null = null, includeFilename = false) {
        if (file) {
            return this.toolbox
                .getInternal()
                .doUpload<PutSourceListYamlResponse, PutSourceListYamlQueryParams>('/source/list/yaml', {
                    params: { includeFilename: String(includeFilename) },
                    files: { archive: file }
                });
        }
        return this.toolbox
            .getInternal()
            .doPut<PutSourceListYamlResponse, any, PutSourceListYamlQueryParams>('/source/list/yaml', {
                params: { url: blueprintUrl, includeFilename: String(includeFilename) }
            });
    }

    async doUploadImage(blueprintId: string, imageFile?: Blob) {
        if (imageFile) {
            return this.toolbox
                .getManager()
                .doUpload(`/blueprints/${blueprintId}/icon`, { files: imageFile, method: 'PATCH' });
        }

        return Promise.resolve();
    }
}
