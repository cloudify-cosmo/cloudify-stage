export default {
    GITHUB_DATA_SOURCE: 'github',
    JSON_DATA_SOURCE: 'json',
    DEFAULT_IMAGE: '/widgets/blueprintCatalog/images/logo.png',
    BLUEPRINT_IMAGE_FILENAME: 'blueprint.png',
    GITHUB_BLUEPRINT_IMAGE_URL: (user,repo) => `/github/content/${user}/${repo}/master/blueprint.png`
};