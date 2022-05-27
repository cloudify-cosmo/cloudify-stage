export default {
    WIDGET_ID: 'blueprintCatalog',
    GITHUB_DATA_SOURCE: 'github',
    JSON_DATA_SOURCE: 'json',
    BLUEPRINT_IMAGE_FILENAME: 'blueprint.png',
    GITHUB_BLUEPRINT_IMAGE_URL: (user: string, repo: string) => `/github/content/${user}/${repo}/master/blueprint.png`,
    CONTEXT_KEY: {
        UPLOADING_BLUEPRINT: 'uploadingBlueprint',
        UPLOADING_BLUEPRINT_ERROR: 'uploadingBlueprintError',
        SELECTED_BLUEPRINT_ID: 'selectedBlueprintId'
    }
};
