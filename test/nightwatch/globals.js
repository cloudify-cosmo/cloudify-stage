const fs = require('fs');
const fetch = require('isomorphic-fetch');

module.exports = {
    // this will overwrite the default polling interval (currently 500ms) for waitFor commands
    // and expect assertions that use retry
    waitForConditionPollInterval : 300,

    // default timeout value in milliseconds for waitFor commands and implicit waitFor value for
    // expect assertions
    waitForConditionTimeout : 20000,

    // controls the timeout time for async hooks. Expects the done() callback to be invoked within this time
    // or an error is thrown
    asyncHookTimeout : 10000,

    // External before hook is ran at the beginning of the tests run, before creating the Selenium session
    before: function(done) {
        const licenseFile = './test/cypress/fixtures/license/valid_trial_license.yaml';
        const licenseUrl = this.test_settings.launch_url + '/console/sp?su=/license';
        const license = fs.readFileSync(licenseFile);

        console.log('Uploading license ' + licenseFile + ' to ' + licenseUrl);
        fetch(licenseUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${Buffer.from('admin:admin').toString('base64')}`,
                'Content-Type': 'text/plain'
            },
            body: license
        })
        .then((response) => {
            if (response.ok) {
                return response;
            } else {
                throw new Error(`Server responded with: status=${response.status}, message=${response.statusText}`);
            }
        })
        .then(() => {
            console.log('License uploaded successfully.');
            done();
        })
        .catch((error) => {
            console.error('Error during license upload.', error);
            process.exit(1);
        })
    },
};