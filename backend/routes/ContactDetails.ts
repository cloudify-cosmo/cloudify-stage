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

router.use(bodyParser.json());
// router.use(validateEdition);

const hubspotRequest = (_data: ContactDetailsDto, createError?: boolean): Promise<HubspotResponseDto> =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (createError) {
                reject('error');
            } else {
                resolve({
                    customer_id: '3fdsafdsafads-fads-fdsafsa'
                });
            }
        }, 500);
    });

const userLicenseRequest = (_data: any, createError?: boolean): Promise<void> =>
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
    customer_id: string;
}
/* eslint-enable camelcase */

enum ContactDetailsStatus {
    NOT_RECEIVED,
    RECEIVED_FROM_USER,
    SUBMITED_TO_HUBSPOT,
    FULLY_SUBMITTED
}

interface StoredContactDetails {
    status: ContactDetailsStatus;
    data: ContactDetailsDto | HubspotResponseDto | Record<string, never>;
}

const getStoredContactDetails = (): StoredContactDetails | null => {
    try {
        const fileContent = fs.readFileSync(contactDetailsFilePath, 'utf8');
        const jsonContent = JSON.parse(fileContent);
        return jsonContent;
    } catch {
        return null;
    }
};

const getContactDetailsStatus = (contactDetails: StoredContactDetails | null): ContactDetailsStatus => {
    return contactDetails?.status || ContactDetailsStatus.NOT_RECEIVED;
};

const saveContactDetailsData = (status: ContactDetailsStatus, detailsData: StoredContactDetails['data']) => {
    const contactDetails: StoredContactDetails = {
        status,
        data: detailsData
    };

    try {
        fs.writeFileSync(contactDetailsFilePath, JSON.stringify(contactDetails), 'utf8');
    } catch (error) {
        logger.error(error);
    }
};

const makeHubspotRequest = async (contactDetails: ContactDetailsDto): Promise<HubspotResponseDto> => {
    try {
        return await hubspotRequest(contactDetails);
    } catch (error) {
        saveContactDetailsData(ContactDetailsStatus.RECEIVED_FROM_USER, contactDetails);
        throw error;
    }
};

const makeUserLicenseRequest = async (hubspotData: HubspotResponseDto): Promise<void> => {
    try {
        return await userLicenseRequest(hubspotData);
    } catch (error) {
        saveContactDetailsData(ContactDetailsStatus.SUBMITED_TO_HUBSPOT, hubspotData);
        throw error;
    }
};

router.get('/', async (_req, res) => {
    const contactDetails = getStoredContactDetails();
    const contactDetailsStatus = getContactDetailsStatus(contactDetails);
    const detailsShouldBeSubmittedAgain =
        contactDetailsStatus === ContactDetailsStatus.RECEIVED_FROM_USER ||
        contactDetailsStatus === ContactDetailsStatus.SUBMITED_TO_HUBSPOT;

    res.send({
        details_received: contactDetailsStatus !== ContactDetailsStatus.NOT_RECEIVED
    });

    // Further functionality should be transparent for the user
    // Because of that, the functionality below is implemented after sending a response to the user
    if (detailsShouldBeSubmittedAgain) {
        try {
            const hubspotResponse =
                contactDetailsStatus === ContactDetailsStatus.SUBMITED_TO_HUBSPOT
                    ? (contactDetails!.data as HubspotResponseDto)
                    : await makeHubspotRequest(contactDetails!.data as ContactDetailsDto);

            await makeUserLicenseRequest(hubspotResponse);
            saveContactDetailsData(ContactDetailsStatus.FULLY_SUBMITTED, {});
        } catch (error) {
            logger.error(error);
        }
    }
});

router.post(
    '/',
    validateFormData,
    async (req, res): Promise<void> => {
        const contactDetails: ContactDetailsDto = req.body;

        res.send({});

        // Further submission of the data should be transparent for the user
        // Because of that, the functionality below is implemented after sending a response to the user
        try {
            const hubspotResponse = await makeHubspotRequest(contactDetails);
            await makeUserLicenseRequest(hubspotResponse);
            saveContactDetailsData(ContactDetailsStatus.FULLY_SUBMITTED, {});
        } catch (error) {
            logger.error(error);
        }
    }
);

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
