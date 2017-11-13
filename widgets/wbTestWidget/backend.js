module.exports = function(r) {
    r.register('POST', 'manager', (req, res, next, helper) => {
        var payload = req.query.payload ? JSON.parse(req.query.payload) : {};
        helper.Manager.doPost(req.query.endpoint, req.headers, payload)
            .then((data) => res.send(data))
            .catch(next);
    });

    r.register('GET', 'manager', (req, res, next, helper) => {
        helper.Manager.doGet(req.query.endpoint, req.headers, {})
            .then((data) => res.send(data))
            .catch(next);
    });

    r.register('PUT', 'manager', (req, res, next, helper) => {
        var payload = req.query.payload ? JSON.parse(req.query.payload) : {};
        helper.Manager.doPut(req.query.endpoint, req.headers, payload)
            .then((data) => res.send(data))
            .catch(next);
    });

    r.register('DELETE', 'manager', (req, res, next, helper) => {
        var payload = req.query.payload ? JSON.parse(req.query.payload) : {};
        helper.Manager.doDelete(req.query.endpoint, req.headers, payload)
            .then((data) => res.send(data))
            .catch(next);
    });


    r.register('POST', 'request', (req, res, next, helper) => {
        helper.Request.doPost(req.query.url, null, null, req.query.payload)
            .then((data) => res.send(data))
            .catch(next);
    });

    r.register('GET', 'request', (req, res, next, helper) => {
        helper.Request.doGet(req.query.url)
            .then((data) => res.send(data))
            .catch(next);
    });

    r.register('PUT', 'request', (req, res, next, helper) => {
        helper.Request.doPut(req.query.url, null, null, req.query.payload)
            .then((data) => res.send(data))
            .catch(next);
    });

    r.register('DELETE', 'request', (req, res, next, helper) => {
        helper.Request.doDelete(req.query.url, null, null, req.query.payload)
            .then((data) => res.send(data))
            .catch(next);
    });


    r.register('POST', 'database', (req, res, next, helper) => {
        helper.Database.create(req.query.key, req.query.value, req, res, next)
            .then((data) => res.send({status:'ok'}))
            .catch(next);
    });

    r.register('GET', 'database', (req, res, next, helper) => {
        helper.Database.readAll(req, res, next)
            .then((data) => res.send({items: data}))
            .catch(next);
    });

    r.register('PUT', 'database', (req, res, next, helper) => {
        helper.Database.update(req.query.key, req.query.value, req, res, next)
            .then((data) => res.send({status:'ok'}))
            .catch(next);
    });

    r.register('DELETE', 'database', (req, res, next, helper) => {
        helper.Database.remove(req.query.id, req, res, next)
            .then((data) => res.send({status:'ok'}))
            .catch(next);
    });

}