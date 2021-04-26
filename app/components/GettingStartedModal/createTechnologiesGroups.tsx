import type {
    GettingStartedSchema,
    GettingStartedSchemaBlueprint,
    GettingStartedSchemaItem,
    GettingStartedSchemaPlugin,
    GettingStartedSchemaSecret
} from './model';

type SecretGroup = {
    secret: GettingStartedSchemaSecret;
    technologies: GettingStartedSchemaItem[];
};

const mapTechnologiesBySecretName = (technologiesSchema: GettingStartedSchema) => {
    const groupedSecrets = {} as Record<string, SecretGroup>;
    technologiesSchema.forEach(technologySchema => {
        technologySchema.secrets.forEach(secretSchema => {
            const group =
                groupedSecrets[secretSchema.name] ??
                (groupedSecrets[secretSchema.name] = { secret: secretSchema, technologies: [] });
            group.technologies.push(technologySchema);
        });
    });
    return groupedSecrets;
};

const mapSecretsByTechnologyName = (groupedSecrets: SecretGroup[]) => {
    const groupedTechnologies = {} as Record<string, GettingStartedSchemaItem>;
    groupedSecrets.forEach(({ secret, technologies }) => {
        const technologyNames: string[] = [];
        const technologyLabels: string[] = [];
        const technologyPlugins: GettingStartedSchemaPlugin[] = [];
        const technologyBlueprints: GettingStartedSchemaBlueprint[] = [];
        technologies.forEach(technology => {
            technologyNames.push(technology.name);
            technologyLabels.push(technology.label);
            technologyPlugins.push(...technology.plugins);
            technologyBlueprints.push(...technology.blueprints);
        });
        const technologyName = _.uniq(technologyNames)
            .map(name => encodeURIComponent(name))
            .join('+');
        const groupedTechnology =
            groupedTechnologies[technologyName] ??
            (groupedTechnologies[technologyName] = {
                name: technologyName,
                logo: '',
                label: _.uniq(technologyLabels).join(' + '),
                plugins: _.uniqBy(technologyPlugins, plugin => `${plugin.name} ${plugin.version}`),
                secrets: [],
                blueprints: technologyBlueprints
            });
        groupedTechnology.secrets.push(secret);
    });
    return groupedTechnologies;
};

/**
 * Creates technology schemas grouped the way that keeps secrets as unique.
 * This function helps to prevent against secrets duplication in technologies.
 * e.g. if there are two technologies (`tech1` and `tech2`) that contain `username` fields,
 *      the function will merge them into `tech1+tech2` group with one `username` field.
 * @param technologiesSchema technologies that will be grouped to provide unique field names.
 * @returns technology groups with unique field names
 */
const createTechnologiesGroups = (technologiesSchema: GettingStartedSchema) => {
    const groupedSecretsMap = mapTechnologiesBySecretName(technologiesSchema);
    const groupedSecretsArray = Object.values(groupedSecretsMap);
    const groupedTechnologiesMap = mapSecretsByTechnologyName(groupedSecretsArray);
    const groupedTechnologiesArray = Object.values(groupedTechnologiesMap);
    return groupedTechnologiesArray;
};

export default createTechnologiesGroups;
