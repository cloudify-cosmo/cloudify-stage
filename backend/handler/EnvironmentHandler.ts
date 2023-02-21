import _, { cloneDeep } from 'lodash';
import type { Blueprint, Input } from 'cloudify-ui-common-backend';
import { renderBlueprintYaml } from 'cloudify-ui-common-backend';
import type { EnvironmentRenderParams, ExternalCapability } from './EnvironmentHandler.types';

export const renderEnvironmentBlueprint = (renderParams: EnvironmentRenderParams) => {
    const labels: Blueprint['labels'] = {
        'csys-obj-type': { values: ['environment'] },
        ..._(renderParams.labels)
            .filter('blueprintDefault')
            .keyBy('key')
            .mapValues(({ value }) => ({ values: [value] }))
            .value()
    };

    const blueprintModel: Blueprint = {
        tosca_definitions_version: 'cloudify_dsl_1_4',
        description: renderParams.description || undefined,
        imports: ['cloudify/types/types.yaml'],
        labels,
        blueprint_labels: cloneDeep(labels),
        node_templates: {
            EnvironmentNode: { type: 'cloudify.nodes.Root' }
        },
        inputs: _(renderParams.capabilities)
            .filter(capability => capability.source !== 'static')
            .keyBy('name')
            .mapValues(capability => {
                const input: Input = { type: 'string' };

                if ((<ExternalCapability>capability).blueprintDefault)
                    input.default =
                        capability.source === 'input' ? capability.value : { 'get-secret': capability.value };

                return input;
            })
            .value(),
        capabilities: _(renderParams.capabilities)
            .keyBy('name')
            .mapValues(capability => ({
                value: capability.source === 'static' ? capability.value : { 'get-input': capability.name }
            }))
            .value()
    };

    return renderBlueprintYaml(blueprintModel);
};
