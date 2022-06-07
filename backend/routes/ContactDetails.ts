import express from 'express';
import fs from 'fs';
import { getLogger } from '../handler/LoggerHandler';
import { getHeadersWithAuthenticationToken, getResourcePath, getTokenFromCookies } from '../utils';
import { jsonRequest } from '../handler/ManagerHandler';

const logger = getLogger('ContactDetails');
const router = express.Router();
const contactDetailsFilePath = getResourcePath('submittedContactDetails.json', true);

/* eslint-disable camelcase */
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

const submitContactDetails = async (contactDetails: ContactDetails, token: string) => {
    try {
        const hubspotResponse = (await jsonRequest(
            'post',
            '/contacts',
            getHeadersWithAuthenticationToken(token),
            contactDetails
        )) as HubspotResponse;
        await jsonRequest('post', '/license', getHeadersWithAuthenticationToken(token), hubspotResponse);
    } catch (error) {
        logger.error(error);
    }
};

router.use(express.json());

router.get('/', async (req, res) => {
    const token = getTokenFromCookies(req);

    try {
        await jsonRequest('get', '/license-check', getHeadersWithAuthenticationToken(token));
        res.send({
            contactDetailsReceived: true
        });
    } catch (error) {
        // Customer ID not found
        logger.debug(error);
        res.send({
            contactDetailsReceived: false
        });
    }
});

router.post(
    '/',
    async (req, res): Promise<void> => {
        const token = getTokenFromCookies(req);
        const contactDetails: ContactDetails = req.body;

        res.send({});

        submitContactDetails(contactDetails, token);
    }
);

export default router;
