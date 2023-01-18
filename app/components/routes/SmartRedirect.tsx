import React from 'react';
import { Redirect } from 'react-router-dom';
import { CONTEXT_PATH } from '../../../backend/consts';
import ExternalRedirect from './ExternalRedirect';

interface SmartRedirectProps {
    url: string;
}

export default function SmartRedirect({ url }: SmartRedirectProps) {
    return url.startsWith(CONTEXT_PATH) ? (
        <Redirect to={url.replace(CONTEXT_PATH, '')} />
    ) : (
        <ExternalRedirect url={url} />
    );
}
