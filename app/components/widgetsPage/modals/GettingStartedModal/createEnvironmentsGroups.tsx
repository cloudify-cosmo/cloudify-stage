import type {
    GettingStartedSchemaBlueprint,
    GettingStartedSchemaItem,
    GettingStartedSchemaPlugin,
    GettingStartedSchemaSecret
} from './model';

type SecretGroup = {
    secret: GettingStartedSchemaSecret;
    environments: GettingStartedSchemaItem[];
};

const mapEnvironmentsBySecretName = (environmentsSchema: GettingStartedSchemaItem[]) => {
    const groupedSecrets = {} as Record<string, SecretGroup>;
    environmentsSchema.forEach(environmentSchema => {
        environmentSchema.secrets.forEach(secretSchema => {
            const group =
                groupedSecrets[secretSchema.name] ??
                (groupedSecrets[secretSchema.name] = { secret: secretSchema, environments: [] });
            group.environments.push(environmentSchema);
        });
    });
    return groupedSecrets;
};

const mapSecretsByEnvironmentName = (groupedSecrets: SecretGroup[]) => {
    const groupedEnvironments = {} as Record<string, GettingStartedSchemaItem>;
    groupedSecrets.forEach(({ secret, environments }) => {
        const environmentNames: string[] = [];
        const environmentLabels: string[] = [];
        const environmentPlugins: GettingStartedSchemaPlugin[] = [];
        const environmentBlueprints: GettingStartedSchemaBlueprint[] = [];
        environments.forEach(environment => {
            environmentNames.push(environment.name);
            environmentLabels.push(environment.label);
            environmentPlugins.push(...environment.plugins);
            environmentBlueprints.push(...environment.blueprints);
        });
        const environmentName = _.uniq(environmentNames)
            .map(name => encodeURIComponent(name))
            .join('+');
        const groupedEnvironment =
            groupedEnvironments[environmentName] ??
            (groupedEnvironments[environmentName] = {
                name: environmentName,
                logo: '',
                label: environments[0].label,
                plugins: _.uniqBy(environmentPlugins, plugin => `${plugin.name} ${plugin.version}`),
                secrets: [],
                blueprints: environmentBlueprints
            });
        groupedEnvironment.secrets.push(secret);
    });
    return groupedEnvironments;
};

/**
 * Creates environment schemas grouped the way that keeps secrets as unique.
 * This function helps to prevent against secrets duplication in environments.
 * e.g. if there are two environments (`tech1` and `tech2`) that contain `username` fields,
 *      the function will merge them into `tech1+tech2` group with one `username` field.
 * @param environmentsSchema environments that will be grouped to provide unique field names.
 * @returns environment groups with unique field names
 */
const createEnvironmentsGroups = (environmentsSchema: GettingStartedSchemaItem[]) => {
    const groupedSecretsMap = mapEnvironmentsBySecretName(environmentsSchema);
    const groupedSecretsArray = Object.values(groupedSecretsMap);
    const groupedEnvironmentsMap = mapSecretsByEnvironmentName(groupedSecretsArray);
    const groupedEnvironmentsArray = Object.values(groupedEnvironmentsMap);
    return groupedEnvironmentsArray;
};

export default createEnvironmentsGroups;
