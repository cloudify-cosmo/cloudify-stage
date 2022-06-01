import type { Logger } from 'cloudify-ui-common/backend/logger';
import type { Request, Response, NextFunction } from 'express';

export default function checkIfFileUploaded(logger: Logger) {
    return function checkIfFileUploadedMiddleware(req: Request, res: Response, next: NextFunction) {
        if (!req.file) {
            const errorMessage = 'No file uploaded.';
            logger.error(errorMessage);

            res.status(400).send({ message: errorMessage });
        } else {
            next();
        }
    };
}
