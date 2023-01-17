import i18n from 'i18next';
import React, { useEffect } from 'react';

interface ExternalRedirectProps {
    url: string;
}

export default function ExternalRedirect({ url }: ExternalRedirectProps) {
    useEffect(() => {
        // eslint-disable-next-line xss/no-location-href-assign
        window.location.href = url;
    }, []);

    return <section>{i18n.t('redirecting', { url })}</section>;
}
