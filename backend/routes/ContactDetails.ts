import express from 'express';
import type { Response } from 'express';
import { getLogger } from '../handler/LoggerHandler';
import { getHeadersWithAuthenticationToken, getTokenFromCookies } from '../utils';
import { jsonRequest } from '../handler/ManagerHandler';
import type {
    ContactDetails,
    HubspotResponse,
    GetContactDetailsResponse,
    PostContactDetailsResponse,
    PostContactDetailsRequestBody
} from './ContactDetails.types';
import type { GenericErrorResponse } from '../types';

const logger = getLogger('ContactDetails');
const router = express.Router();

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

router.get('/', async (req, res: Response<GetContactDetailsResponse>) => {
    const token = getTokenFromCookies(req);

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

router.post<never, PostContactDetailsResponse | GenericErrorResponse, PostContactDetailsRequestBody>(
    '/',
    async (req, res): Promise<void> => {
        const token = getTokenFromCookies(req);
        const contactDetails = req.body;

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
    }
);

export default router;
