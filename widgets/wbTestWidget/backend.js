module.exports = function(r) {
    r.register('test', (req, res, next, helper) => {
        helper.callManager('GET', 'users', req)
            .then((data) => res.send(data))
            .catch(next);
    });
}