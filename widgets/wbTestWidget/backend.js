module.exports = function(r) {
    r.register('manager', (req, res, next, helper) => {
        helper.callManager('GET', 'users', req)
            .then((data) => res.send(data))
            .catch(next);
    });


    r.register('wbTestReadItems', (req, res, next, helper) => {
        helper.db.readAll(req, res, next)
            .then((data) => res.send(data))
            .catch(next);
    });


    r.register('wbTestCreateItem', (req, res, next, helper) => {
        helper.db.create(req.query.key, req.query.value, req, res, next)
            .then((data) => res.send(data))
            .catch(next);
    });


    r.register('wbTestDeleteItem', (req, res, next, helper) => {
        helper.db.delete(req.query.key, req, res, next)
            .then((data) => res.send(data))
            .catch(next);
    });

}