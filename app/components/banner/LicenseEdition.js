/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import React from 'react';

export default function LicenseEdition({edition, className = ''}) {
    return !_.isEmpty(edition) &&
        <span style={{color: 'white', verticalAlign: 'middle'}} className={className}> {edition}</span>
}