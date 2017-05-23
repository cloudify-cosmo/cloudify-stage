module.exports = (function(settings) {
    console.log(`Running nightwatch on ${process.platform} platform.`);
    if (process.platform === 'win32') {
        settings.selenium.cli_args['webdriver.chrome.driver']  = "./e2e/bin/chromedriver.exe";
    }
    return settings;
})(require('./nightwatch.json'));