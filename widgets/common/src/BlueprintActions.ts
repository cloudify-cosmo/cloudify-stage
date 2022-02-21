// eslint-disable-next-line max-classes-per-file
class BlueprintUploadError extends Error {
    constructor(message: string | null, public state: string) {
        super(message ?? '');
    }
}

/* eslint-disable camelcase */
export interface FullBlueprintData {
    id: string;
    visibility: string;
    created_at: string;
    main_file_name: string;
    plan: {
        description: null | unknown;
        metadata: null | unknown;
        nodes: unknown[];
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
    };
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
}
/* eslint-enable camelcase */

export interface BlueprintDeployParams {
    blueprintId: string;
    deploymentId: string;
    deploymentName: string;
    inputs: Record<string, any>;
    visibility: string;
    labels: Stage.Common.Labels.Label[];
    skipPluginsValidation?: boolean;
    siteName?: string;
    runtimeOnlyEvaluation?: boolean;
}

export default class BlueprintActions {
    static InProgressBlueprintStates = {
        Pending: 'pending',
        Uploading: 'uploading',
        Extracting: 'extracting',
        Parsing: 'parsing',
        UploadingImage: 'uploading_image'
    };

    static CompletedBlueprintStates = {
        Uploaded: 'uploaded',
        FailedUploading: 'failed_uploading',
        FailedExtracting: 'failed_extracting',
        FailedParsing: 'failed_parsing',
        Invalid: 'invalid'
    };

    static isUploaded(blueprint: { state: string }) {
        return blueprint.state === BlueprintActions.CompletedBlueprintStates.Uploaded;
    }

    static isCompleted(blueprint: { state: string }) {
        return Object.values(BlueprintActions.CompletedBlueprintStates).includes(blueprint.state);
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
            state: BlueprintActions.CompletedBlueprintStates.Uploaded,
            ...params
        });
    }

    doGetFullBlueprintData(blueprintId: string): Promise<FullBlueprintData> {
        return this.toolbox.getManager().doGet(`/blueprints/${blueprintId}`);
    }

    doDelete(blueprintId: string, force = false) {
        return this.toolbox
            .getManager()
            .doDelete(`/blueprints/${blueprintId}`, { params: { force } })
            .then(() => this.doDeleteImage(blueprintId));
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
        const { DeploymentActions } = Stage.Common;
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

    doUpload(
        blueprintName: string,
        {
            blueprintYamlFile,
            blueprintUrl,
            file,
            imageUrl,
            image,
            visibility = Stage.Common.Consts.defaultVisibility,
            onStateChanged = _.noop
        }: {
            blueprintYamlFile?: string;
            blueprintUrl?: string;
            file?: Blob & { name: string };
            imageUrl?: string;
            image?: any;
            visibility?: string;
            onStateChanged?: (state: string) => void;
        }
    ) {
        const params: Record<string, any> = { visibility, async_upload: true };

        if (!_.isEmpty(blueprintYamlFile)) {
            params.application_file_name = blueprintYamlFile;
        }
        if (!_.isEmpty(blueprintUrl)) {
            params.blueprint_archive_url = blueprintUrl;
        }

        let promise;
        if (file) {
            const compressFile = _.endsWith(file.name, '.yaml') || _.endsWith(file.name, '.yml');
            promise = this.toolbox
                .getManager()
                .doUpload(`/blueprints/${blueprintName}`, { params, files: file, parseResponse: false, compressFile });
        } else {
            promise = this.toolbox.getManager().doPut(`/blueprints/${blueprintName}`, { params });
        }

        return promise
            .then(() => this.waitUntilUploaded(blueprintName, onStateChanged))
            .then(() => onStateChanged(BlueprintActions.InProgressBlueprintStates.UploadingImage))
            .then(() => this.doUploadImage(blueprintName, imageUrl, image));
    }

    async waitUntilUploaded(blueprintName: string, onStateChanged: (state: string) => void) {
        const { PollHelper } = Stage.Common;
        const pollHelper = new PollHelper(60);

        let previousState = BlueprintActions.InProgressBlueprintStates.Pending;
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

    doListYamlFiles(blueprintUrl: string, file = null, includeFilename = false) {
        if (file) {
            return this.toolbox
                .getInternal()
                .doUpload('/source/list/yaml', { params: { includeFilename }, files: { archive: file } });
        }
        return this.toolbox
            .getInternal()
            .doPut('/source/list/yaml', { params: { url: blueprintUrl, includeFilename } });
    }

    doUploadImage(blueprintId: string, imageUrl: string | undefined, files: any) {
        if (_.isEmpty(imageUrl) && !files) {
            return Promise.resolve();
        }

        const params = { imageUrl };
        if (files) {
            return this.toolbox.getInternal().doUpload(`/ba/image/${blueprintId}`, { params, files, method: 'post' });
        }
        return this.toolbox.getInternal().doPost(`/ba/image/${blueprintId}`, { params });
    }

    doDeleteImage(blueprintId: string) {
        return this.toolbox.getInternal().doDelete(`/ba/image/${blueprintId}`);
    }
}

declare global {
    namespace Stage.Common {
        export { BlueprintActions };
    }
}

Stage.defineCommon({
    name: 'BlueprintActions',
    common: BlueprintActions
});
