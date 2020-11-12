/**
 * Created by jakubniezgoda on 23/04/2018.
 */

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import i18n from 'i18next';

export default function ExternalRedirect({ url }) {
    useEffect(() => {
        // eslint-disable-next-line scanjs-rules/assign_to_location
        window.location = url;
    }, []);

    return <section>{i18n.t('redirecting', 'Redirecting to {{url}}...', { url })}</section>;
}

ExternalRedirect.propTypes = {
    url: PropTypes.string.isRequired
};
