export default {
    WIDGET_ID: 'blueprintCatalog',
    GITHUB_DATA_SOURCE: 'github',
    JSON_DATA_SOURCE: 'json',
    DEFAULT_IMAGE: '/images/logo.png',
    BLUEPRINT_IMAGE_FILENAME: 'blueprint.png',
    GITHUB_BLUEPRINT_IMAGE_URL: (user: string, repo: string) => `/github/content/${user}/${repo}/master/blueprint.png`,
    CONTEXT_KEY: {
        UPLOADING_BLUEPRINT: 'uploadingBlueprint'
    }
};
