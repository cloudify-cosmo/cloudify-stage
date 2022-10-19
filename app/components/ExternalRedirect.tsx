// @ts-nocheck File not migrated fully to TS

import i18n from 'i18next';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

export default function ExternalRedirect({ url }) {
    useEffect(() => {
        window.location = url;
    }, []);

    return <section>{i18n.t('redirecting', 'Redirecting to {{url}}...', { url })}</section>;
}

ExternalRedirect.propTypes = {
    url: PropTypes.string.isRequired
};
