import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { getLogger } from '../handler/LoggerHandler';
import { getMode, MODE_COMMUNITY } from '../serverSettings';
import { getResourcePath } from '../utils';

const logger = getLogger('ContactDetails');
const router = express.Router();
const contactDetailsFilePath = getResourcePath('submittedContactDetails.json', true);

const hubspotRequest = (_data: any, createError?: boolean): Promise<string> =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (createError) {
                reject('error');
            } else {
                resolve('custom-costumer-id');
            }
        }, 500);
    });

const managerRequest = (_data: any, createError?: boolean): Promise<void> =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (createError) {
                reject('error');
            } else {
                resolve();
            }
        }, 500);
    });

/* eslint-disable camelcase */

interface ContactDetailsDto {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_eula: boolean;
    is_send_services_details?: boolean;
}

interface HubspotResponseDto {
    clientId: string;
}

enum ContactDetailsStatus {
    NOT_RECEIVED,
    RECEIVED,
    SUBMITTED_TO_HUBSPOT,
    SUBMITTED_TO_MANAGER
}

interface StoredContactDetails {
    status: ContactDetailsStatus;
    data: ContactDetailsDto | HubspotResponseDto;
}

const getContactDetailsFile = (): StoredContactDetails | null => {
    try {
        const fileContent = fs.readFileSync(contactDetailsFilePath, 'utf8');
        const jsonContent = JSON.parse(fileContent);
        return jsonContent;
    } catch {
        return null;
    }
};

const getContactDetailsStatus = (): ContactDetailsStatus => {
    const contactDetails = getContactDetailsFile();
    return contactDetails?.status || ContactDetailsStatus.NOT_RECEIVED;
};

const saveContactDetailsData = (contactDetails: StoredContactDetails) => {
    try {
        fs.writeFileSync(contactDetailsFilePath, JSON.stringify(contactDetails), 'utf8');
    } catch (error) {
        logger.error(error);
    }
};

router.use(bodyParser.json());
// router.use(validateEdition);

router.get('/', (req, res) => {
    const contactDetailsStatus = getContactDetailsStatus();
    res.send({
        details_received: contactDetailsStatus !== ContactDetailsStatus.NOT_RECEIVED
    });
});

router.post('/', validateFormData, (req, res) => {
    saveContactDetailsData({
        status: ContactDetailsStatus.RECEIVED,
        data: { clientId: '4' }
    });
    res.send(req.body);
});

export default router;

function validateEdition(req: Request, res: Response, next: NextFunction) {
    if (getMode() !== MODE_COMMUNITY) {
        logger.error(`Endpoint ${req.baseUrl} only available in community edition.`);
        res.sendStatus(403);
    }
    next();
}

function validateFormData(req: Request, res: Response, next: NextFunction) {
    const requiredFields: (keyof ContactDetailsDto)[] = ['first_name', 'last_name', 'email', 'phone', 'is_eula'];
    requiredFields.forEach(requiredField => {
        if (typeof req.body[requiredField] === 'undefined') {
            res.send(403);
        }
    });
    next();
}
