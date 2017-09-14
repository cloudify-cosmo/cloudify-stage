module.exports = function(r) {
    r.register('manager', (req, res, next, helper) => {
        helper.callManager('GET', 'users', req)
            .then((data) => res.send(data))
            .catch(next);
    });
    r.register('databaseReadKey', (req, res, next, helper) => {
        helper.db.read('key1', req, res, next)
            .then((data) => res.send(data))
            .catch(next);
    });
    r.register('databaseCreateKey', (req, res, next, helper) => {
        helper.db.create('key1', {a: 1, b: 2}, req, res, next)
            .then((data) => res.send(data))
            .catch(next);
    });
    r.register('databaseUpdateKey', (req, res, next, helper) => {
        helper.db.update('key1', {a: 4, b: 5}, req, res, next)
            .then((data) => res.send(data))
            .catch(next);
    });
    r.register('databaseDeleteKey', (req, res, next, helper) => {
        helper.db.delete('key1', req, res, next)
            .then((data) => res.send('Number of rows removed: ' + data))
            .catch(next);
    });
}