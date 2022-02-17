import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { getLogger } from '../handler/LoggerHandler';
import { getResourcePath } from '../utils';
import { jsonRequest } from '../handler/ManagerHandler';

const logger = getLogger('ContactDetails');
const router = express.Router();
const contactDetailsFilePath = getResourcePath('submittedContactDetails.json', true);

/* eslint-disable camelcase */
// NOTE: DTO are used as a shapes of requests which are sent/received
interface ContactDetails {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_eula: boolean;
    is_send_services_details?: boolean;
}

interface HubspotResponse {
    customer_id: string;
}
/* eslint-enable camelcase */

// Reading the data from the stored file
const getStoredContactDetails = (): ContactDetails => {
    // Synchronised methods were used, as they are more common in the backend that async methods
    const fileContent = fs.readFileSync(contactDetailsFilePath, 'utf8');
    const jsonContent = JSON.parse(fileContent);
    return jsonContent;
};

const saveContactDetailsData = (contactDetails: ContactDetails) => {
    fs.writeFileSync(contactDetailsFilePath, JSON.stringify(contactDetails), 'utf8');
};

const submitContactDetails = async (contactDetails: ContactDetails, token: string) => {
    try {
        const hubspotResponse = (await jsonRequest(
            'post',
            '/contacts',
            {
                'Authentication-Token': token
            },
            contactDetails
        )) as HubspotResponse;
        await jsonRequest('post', '/license', { 'Authentication-Token': token }, hubspotResponse);
    } catch (error) {
        logger.error(error);
    }
};

router.use(bodyParser.json());

router.get('/', async (req, res) => {
    const token = req.headers['authentication-token'] as string;
    const contactDetailsReceived = fs.existsSync(contactDetailsFilePath);

    res.send({
        contactDetailsReceived
    });

    // Further functionality should be transparent for the user
    // Because of that, the functionality below is implemented after sending a response to the user
    if (!contactDetailsReceived) return;

    try {
        await jsonRequest('get', '/license-check', {
            'Authentication-Token': token
        });
    } catch (error) {
        // Customer ID not found
        logger.debug(error);
        submitContactDetails(getStoredContactDetails(), token);
    }
});

router.post(
    '/',
    async (req, res): Promise<void> => {
        const token = req.headers['authentication-token'] as string;
        const contactDetails: ContactDetails = req.body;

        res.send({});

        // Further submission of the data should be transparent for the user
        // Because of that, the functionality below is implemented after sending a response to the user
        saveContactDetailsData(contactDetails);
        submitContactDetails(contactDetails, token);
    }
);

export default router;
