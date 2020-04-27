import React from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from 'semantic-ui-react';

export default function LoadingOverlay({ message }) {
    return (
        <Dimmer active inverted>
            <Loader>{message}</Loader>
        </Dimmer>
    );
}

LoadingOverlay.propTypes = {
    /**
     * text message to display under loading icon
     */
    message: PropTypes.string
};

LoadingOverlay.defaultProps = {
    message: null
};
