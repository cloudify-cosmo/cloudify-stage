import i18n from 'i18next';
import React, { useEffect } from 'react';
import LogoPage from './LogoPage';

interface ExternalRedirectProps {
    url: string;
}

export default function ExternalRedirect({ url }: ExternalRedirectProps) {
    useEffect(() => {
        // eslint-disable-next-line xss/no-location-href-assign
        window.location.href = url;
    }, []);

    return (
        <LogoPage>
            {i18n.t('redirecting')} <a href={url}>{url}</a>...
        </LogoPage>
    );
}
