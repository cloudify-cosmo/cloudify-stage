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

// Mocked requests, they should be recreated so that they'd communicate with the specific endpoints, rather than being a mocked promises
// Currently values required and returned from those requests are correctly typed
const MOCKED_REQUEST = {
    // This request should communicate with the endpoint mentioned in https://cloudifysource.atlassian.net/browse/RD-3950
    hubspot: (_data: ContactDetailsDto, createError?: boolean): Promise<HubspotResponseDto> =>
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
        }),

    // This request should communicate with the endpoint mentioned in https://cloudifysource.atlassian.net/browse/RD-3948 (scroll down to the comments section, to see more details)
    userLicense: (_data: any, createError?: boolean): Promise<void> =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                if (createError) {
                    reject('error');
                } else {
                    resolve();
                }
            }, 500);
        })
};

// As the feature has to be implemented only in community edition, I've added validation regarding that matter
function validateEdition(req: Request, res: Response, next: NextFunction) {
    if (getMode() !== MODE_COMMUNITY) {
        logger.error(`Endpoint ${req.baseUrl} only available in community edition.`);
        res.sendStatus(403);
    }
    next();
}

// Basic validation if all the required by the HUBSPOT endpoint values are being provided
// More detailed validation was implemented on the frontend side, inside the ContactDetailsForm/form-fields.ts file
function validateFormData(req: Request, res: Response, next: NextFunction) {
    const requiredFields: (keyof ContactDetailsDto)[] = ['first_name', 'last_name', 'email', 'phone', 'is_eula'];
    requiredFields.forEach(requiredField => {
        if (typeof req.body[requiredField] === 'undefined') {
            res.send(403);
        }
    });
    next();
}

/* eslint-disable camelcase */
// NOTE: DTO are used as a shapes of requests which are sent/received
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

/*
    This enum is describing possible scenarios related to the data retrieval/submission:

    NOT_RECEIVED -> User didn't submit data yet,
    RECEIVED_FROM_USER -> Data has been collected from user, but the error occured while sending it to the HUBSPOT endpoint
    SUBMITTED_TO_HUBSPOT -> Data has been successfully submited to the HUBSPOT, but the error occur while trying to send it to the license endpoint
    FULLY_SUBMITTED -> Data has been successfully submitted to all endpoints
*/
enum ContactDetailsStatus {
    NOT_RECEIVED,
    RECEIVED_FROM_USER,
    SUBMITTED_TO_HUBSPOT,
    FULLY_SUBMITTED
}

/*
    Shape of the file, which is saved inside the userData directory (path is stored inside the contactDetailsFilePath variable)
    File is being used to determine the current state of the contact details data submission and to store data needed for sending a request to hubspot or license endpoint
    Data is correlated with the current value of the status.
    E.g. when the status === ContactDetailsStatus.RECEIVED_FROM_USER, we propably have previously encountered error while sending the data to the Hubspot endpoint.
    That's why, in that case, the data is being stored in shape which is needed for sending that specific request.

    One note, that if the process has been completed (status === ContactDetailsStatus.FULLY_SUBMITTED),
    then there is no need for the data to be stored, that's why in one of the cases it's legal to use {}, which is declared as Record<string, never>
*/
interface StoredContactDetails {
    status: ContactDetailsStatus;
    data: ContactDetailsDto | HubspotResponseDto | Record<string, never>;
}

// Reading the data from the stored file (which definition is described with the usage of StoredContactDetails)
const getStoredContactDetails = (): StoredContactDetails | null => {
    try {
        // Synchronised methods were used, as they are more common in the backend that async methods
        const fileContent = fs.readFileSync(contactDetailsFilePath, 'utf8');
        const jsonContent = JSON.parse(fileContent);
        return jsonContent;
    } catch {
        return null;
    }
};

// Getter for retrieving the current status of the submission.
// If the file doesn't exists, the ContactDetailsStatus.NOT_RECEIVED is being returned as a default status
const getContactDetailsStatus = (contactDetails: StoredContactDetails | null): ContactDetailsStatus => {
    return contactDetails?.status || ContactDetailsStatus.NOT_RECEIVED;
};

// Saving/updating details to the file
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

/*
    Method is responsible for:
    - handling sending contactDetails to the Hubspot endpoint
    - saving current state of the process (with the needed data, needed for the retry)  
*/
const makeHubspotRequest = async (contactDetails: ContactDetailsDto): Promise<HubspotResponseDto> => {
    try {
        return await MOCKED_REQUEST.hubspot(contactDetails);
    } catch (error) {
        saveContactDetailsData(ContactDetailsStatus.RECEIVED_FROM_USER, contactDetails);
        throw error;
    }
};

/*
    Method is responsible for:
    - handling sending contactDetails to the license endpoint
    - saving current state of the process (with the needed data, needed for the retry)  
*/
const makeUserLicenseRequest = async (hubspotData: HubspotResponseDto): Promise<void> => {
    try {
        return await MOCKED_REQUEST.userLicense(hubspotData);
    } catch (error) {
        saveContactDetailsData(ContactDetailsStatus.SUBMITTED_TO_HUBSPOT, hubspotData);
        throw error;
    }
};

router.use(bodyParser.json());
router.use(validateEdition);

router.get('/', async (_req, res) => {
    const contactDetails = getStoredContactDetails();
    const contactDetailsStatus = getContactDetailsStatus(contactDetails);
    const detailsShouldBeSubmittedAgain =
        contactDetailsStatus === ContactDetailsStatus.RECEIVED_FROM_USER ||
        contactDetailsStatus === ContactDetailsStatus.SUBMITTED_TO_HUBSPOT;

    res.send({
        details_received: contactDetailsStatus !== ContactDetailsStatus.NOT_RECEIVED
    });

    // Further functionality should be transparent for the user
    // Because of that, the functionality below is implemented after sending a response to the user
    if (detailsShouldBeSubmittedAgain) {
        try {
            const hubspotResponse =
                contactDetailsStatus === ContactDetailsStatus.SUBMITTED_TO_HUBSPOT
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
