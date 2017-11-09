module.exports = function(r) {
    r.register('manager', (req, res, next, helper) => {
        helper.Manager.call('GET', req.query.endpoint, req)
            .then((data) => res.send(data))
            .catch(next);
    });

    r.register('request', (req, res, next, helper) => {
        helper.Request.call(req.method, req.query.url)
            .then((data) => res.send(data))
            .catch(next);
    });

    r.register('wbTestReadItems', (req, res, next, helper) => {
        helper.Database.readAll(req, res, next)
            .then((data) => res.send({items: data}))
            .catch(next);
    });


    r.register('wbTestCreateItem', (req, res, next, helper) => {
        helper.Database.create(req.query.key, req.query.value, req, res, next)
            .then((data) => res.send({status:'ok'}))
            .catch(next);
    });


    r.register('wbTestDeleteItem', (req, res, next, helper) => {
        helper.Database.remove(req.query.id, req, res, next)
            .then((data) => res.send({status:'ok'}))
            .catch(next);
    });

}