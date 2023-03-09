import _, { identity, mapValues, merge } from 'lodash';
import type { Blueprint } from 'cloudify-ui-common-backend';
import { renderBlueprintYaml } from 'cloudify-ui-common-backend';
import type { ClusterCredentialName, HelmRenderParams } from './HelmHandler.types';
import {
    createConcatCall,
    createGetAttributeCall,
    createGetSysCall,
    createIntrinsicFunctionCall
} from './services/BlueprintBuilder';

export const renderHelmBlueprint = (renderParams: HelmRenderParams) => {
    function createClientConfig(wrappers: Partial<Record<ClusterCredentialName, (value: any) => any>> = {}) {
        return {
            configuration: {
                api_options: mapValues(
                    renderParams.clusterCredentials,
                    (credential, credentialName: ClusterCredentialName) =>
                        (wrappers[credentialName] ?? identity)(
                            createIntrinsicFunctionCall(`get_${credential.source}`, credential.value)
                        )
                )
            }
        };
    }

    const helmInstallRelationship = { target: 'helm_install', type: 'cloudify.helm.relationships.run_on_host' };
    const name = createGetSysCall('deployment', 'id');

    const blueprintModel: Blueprint = {
        tosca_definitions_version: 'cloudify_dsl_1_4',
        description: renderParams.description || undefined,
        imports: ['cloudify/types/types.yaml', 'plugin:cloudify-helm-plugin', 'plugin:cloudify-kubernetes-plugin'],
        inputs: _(renderParams.clusterCredentials)
            .filter(credential => credential.source === 'input')
            .keyBy('value')
            .mapValues(() => ({ type: 'string' }))
            .value(),
        node_templates: {
            helm_install: {
                type: 'cloudify.nodes.helm.Binary',
                properties: {
                    use_existing_resource: false,
                    installation_source: 'https://get.helm.sh/helm-v3.7.2-linux-amd64.tar.gz'
                }
            },
            repo: {
                type: 'cloudify.nodes.helm.Repo',
                properties: {
                    resource_config: {
                        name: 'repo',
                        repo_url: renderParams.repository
                    }
                },
                relationships: [helmInstallRelationship]
            },
            release: {
                type: 'cloudify.nodes.helm.Release',
                properties: {
                    client_config: createClientConfig(),
                    resource_config: {
                        name,
                        chart: renderParams.chart
                    }
                },
                relationships: [helmInstallRelationship, { target: 'repo', type: 'cloudify.relationships.depends_on' }]
            },
            svc: {
                type: 'cloudify.kubernetes.resources.Service',
                properties: {
                    client_config: createClientConfig({ host: value => createConcatCall('https://', value) }),
                    use_external_resource: true,
                    allow_node_redefinition: false,
                    definition: {
                        apiVersion: 'v1',
                        kind: 'Service',
                        metadata: { name }
                    }
                },
                relationships: [{ target: 'release', type: 'cloudify.relationships.depends_on' }]
            }
        },
        labels: {
            'obj-type': {
                values: ['helm']
            }
        },
        capabilities: ['ip', 'hostname']
            .map(capabilityKey => ({
                [capabilityKey]: {
                    value: createGetAttributeCall(
                        'svc',
                        'kubernetes',
                        'status',
                        'load_balancer',
                        'ingress',
                        0,
                        capabilityKey
                    )
                }
            }))
            .reduce(merge, {})
    };

    return renderBlueprintYaml(blueprintModel);
};
