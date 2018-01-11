module.exports = {
    // this will overwrite the default polling interval (currently 500ms) for waitFor commands
    // and expect assertions that use retry
    waitForConditionPollInterval : 300,

    // default timeout value in milliseconds for waitFor commands and implicit waitFor value for
    // expect assertions
    waitForConditionTimeout : 20000,

    // controls the timeout time for async hooks. Expects the done() callback to be invoked within this time
    // or an error is thrown
    asyncHookTimeout : 10000
};