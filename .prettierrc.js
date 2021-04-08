module.exports = {
    ...require('./node_modules/cloudify-ui-common/configs/prettier-common.json'),
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2
            }
        }
    ]
};
