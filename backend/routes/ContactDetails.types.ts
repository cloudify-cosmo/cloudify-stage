/* eslint-disable camelcase */
export interface ContactDetails {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_eula: boolean;
    is_send_services_details?: boolean;
}

export interface HubspotResponse {
    customer_id: string;
}
/* eslint-enable camelcase */

export interface GetContactDetailsResponse {
    contactDetailsReceived: boolean;
}

export type PostContactDetailsResponse = {
    status: 'ok';
};

export type PostContactDetailsRequestBody = ContactDetails;
