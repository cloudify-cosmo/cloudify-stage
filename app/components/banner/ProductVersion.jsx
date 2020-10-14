/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

export default function ProductVersion({ version, className }) {
    const versionMatches = version.match(/^(\d+)\.(\d+).*$/);
    const major = !!versionMatches && _.size(versionMatches) >= 2 ? versionMatches[1] : '';
    const minor = !!versionMatches && _.size(versionMatches) >= 3 ? versionMatches[2] : '';
    const shortVersion = `${major}${minor ? `.${minor}` : ''}`;

    return (
        !_.isEmpty(shortVersion) && (
            <span style={{ color: '#C1C1C6', verticalAlign: 'middle' }} className={className}>
                {' '}
                {shortVersion}
            </span>
        )
    );
}

ProductVersion.propTypes = {
    version: PropTypes.string.isRequired,
    className: PropTypes.string
};

ProductVersion.defaultProps = {
    className: ''
};
