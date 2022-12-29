import type { Response } from 'express';
import express from 'express';
import { omit } from 'lodash';
import { db } from '../db/Connection';
import type { UserAppsInstance } from '../db/models/UserAppsModel';
import type { UserAppsAttributes } from '../db/models/UserAppsModel.types';

const router = express.Router();

router.use(express.json());

const propertiesToOmit = ['id', 'tenant'] as const;
type PropertiesToOmit = typeof propertiesToOmit[number];
type UserAppsSnapshot = Omit<UserAppsAttributes, PropertiesToOmit>[];

router.get('/ua', (req, res: Response<UserAppsSnapshot>, next) => {
    db.UserApps.findAll<UserAppsInstance>({
        where: {
            tenant: req.headers.tenant
        },
        attributes: Object.keys(omit(db.UserApps.getAttributes(), propertiesToOmit))
    })
        .then(userApps => {
            res.send(userApps);
        })
        .catch(next);
});

router.post<never, { message: string }, UserAppsSnapshot>('/ua', (req, res, next) => {
    db.sequelize
        ?.transaction(transaction =>
            Promise.all(
                req.body.map(userAppSnapshot =>
                    db.UserApps.create<UserAppsInstance>(
                        { ...userAppSnapshot, tenant: req.headers.tenant as string },
                        { transaction }
                    )
                )
            )
        )
        .then(() => res.status(201).send())
        .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError')
                res.status(400).send({ message: 'Snapshot data conflicts with already existing data' });
            else next(err);
        });
});

export default router;
