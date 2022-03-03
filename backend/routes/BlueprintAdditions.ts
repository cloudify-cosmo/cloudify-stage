import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import _ from 'lodash';
import { db } from '../db/Connection';
import { authenticateWithToken } from '../auth/AuthMiddlewares';
import type { BlueprintAdditionsInstance } from '../db/models/BlueprintAdditionsModel';

const router = express.Router();

router.use(
    bodyParser.raw({
        limit: '1mb',
        type: 'image/*'
    })
);

// This path returns image resource so there is no point to secure that
// (if yes all credentials should be passed in the query string)
router.get('/image/:blueprint', (req, res, next) => {
    db.BlueprintAdditions.findOne<BlueprintAdditionsInstance>({ where: { blueprintId: req.params.blueprint } })
        .then(additions => {
            if (additions) {
                if (additions.image) {
                    res.contentType('image/*').send(additions.image);
                    return;
                }
                if (additions.imageUrl) {
                    res.redirect(additions.imageUrl);
                    return;
                }
            }
            res.contentType('image/png').sendFile(
                path.resolve(__dirname, '../node_modules/cloudify-ui-common/images/logo_color.png')
            );
        })
        .catch(next);
});

router.post<any, any, any, any, { imageUrl?: string }>('/image/:blueprint', authenticateWithToken, (req, res, next) => {
    db.BlueprintAdditions.findOrCreate<BlueprintAdditionsInstance>({ where: { blueprintId: req.params.blueprint } })
        .then(([blueprintAdditions]) => {
            blueprintAdditions
                .update(
                    { image: _.isEmpty(req.body) ? null : req.body, imageUrl: req.query.imageUrl },
                    { fields: ['image', 'imageUrl'] }
                )
                .then(() => {
                    res.end(JSON.stringify({ status: 'ok' }));
                });
        })
        .catch(next);
});

router.delete('/image/:blueprint', authenticateWithToken, (req, res, next) => {
    db.BlueprintAdditions.destroy<BlueprintAdditionsInstance>({ where: { blueprintId: req.params.blueprint } })
        .then(() => {
            res.end(JSON.stringify({ status: 'ok' }));
        })
        .catch(next);
});

export default router;
