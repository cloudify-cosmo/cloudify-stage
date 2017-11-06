/**
 * Created by jakubniezgoda on 06/11/2017.
 */

var ManagerHandler = require('../ManagerHandler');

module.exports = (function() {
    function call(method, url, req) {
        return ManagerHandler.jsonRequest(method, url, req.headers);
    }

    return {
        call
    };
})();