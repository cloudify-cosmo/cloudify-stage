import React from 'react';
import { Redirect } from 'react-router-dom';
import { CONTEXT_PATH } from '../../../backend/consts';
import ExternalRedirect from './ExternalRedirect';
import stageUtils from '../../utils/stageUtils';

interface SmartRedirectProps {
    url: string;
}

export default function SmartRedirect({ url }: SmartRedirectProps) {
    return stageUtils.Url.isLocalUrl(url) ? (
        <Redirect to={url.replace(CONTEXT_PATH, '')} />
    ) : (
        <ExternalRedirect url={url} />
    );
}
