module.exports = function(r) {
    r.register('manager', (req, res, next, helper) => {
        helper.Manager.call('GET', 'users', req)
            .then((data) => res.send(data))
            .catch(next);
    });


    r.register('wbTestReadItems', (req, res, next, helper) => {
        helper.Database.readAll(req, res, next)
            .then((data) => res.send(data))
            .catch(next);
    });


    r.register('wbTestCreateItem', (req, res, next, helper) => {
        helper.Database.create(req.query.key, req.query.value, req, res, next)
            .then((data) => res.send(data))
            .catch(next);
    });


    r.register('wbTestDeleteItem', (req, res, next, helper) => {
        helper.Database.remove(req.query.key, req, res, next)
            .then((data) => res.send(data))
            .catch(next);
    });

}