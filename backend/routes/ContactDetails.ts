import express from 'express';
import { getLogger } from '../handler/LoggerHandler';
import { getHeadersWithAuthenticationToken, getTokenFromCookies } from '../utils';
import { jsonRequest } from '../handler/ManagerHandler';

const logger = getLogger('ContactDetails');
const router = express.Router();

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

const sendDataToHubspot = (contactDetails: ContactDetails, token: string): Promise<HubspotResponse> => {
    return jsonRequest('post', '/contacts', getHeadersWithAuthenticationToken(token), contactDetails);
};

const sendHubspotDataToManager = (hubspotData: HubspotResponse, token: string) => {
    return jsonRequest('post', '/license', getHeadersWithAuthenticationToken(token), hubspotData);
};

const checkContactDetailsExistance = (token: string) => {
    return jsonRequest('get', '/license-check', getHeadersWithAuthenticationToken(token));
};

const submitContactDetails = async (contactDetails: ContactDetails, token: string) => {
    const hubspotResponse = await sendDataToHubspot(contactDetails, token);
    return sendHubspotDataToManager(hubspotResponse, token);
};

router.use(express.json());

router.get('/', async (req, res) => {
    const token = getTokenFromCookies(req);

    return res.send({
        contactDetailsReceived: false
    });

    try {
        await checkContactDetailsExistance(token);
        res.send({
            contactDetailsReceived: true
        });
    } catch (error) {
        // Customer ID not found
        logger.warn(error);
        res.send({
            contactDetailsReceived: false
        });
    }
});

router.post('/', async (req, res): Promise<void> => {
    const token = getTokenFromCookies(req);
    const contactDetails: ContactDetails = req.body;

    try {
        await submitContactDetails(contactDetails, token);
        res.send({
            status: 'ok'
        });
    } catch (error: any) {
        const errorMessage = `Cannot submit contact details. Error: ${error.message}`;
        logger.error(errorMessage);
        res.status(400).send({ message: errorMessage });
    }
});

export default router;
