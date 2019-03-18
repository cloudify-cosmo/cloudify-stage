/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import React from 'react';
import {Link} from 'react-router-dom';

import {Label} from '../basic';
import Consts from '../../utils/consts';

export default function LicenseTag({isCommunity, isExpired, isTrial, className = ''}) {
    const labelProps
        = isCommunity
        ? {content: 'Community', color: 'gray'}
        : isExpired
            ? {content: 'Expired', color: 'red'}
            : isTrial
                ? {content: 'Trial', color: 'orange'}
                : {};

    const LicenseLabel = (labelProps) =>
        <Label {...labelProps} size='large' style={{marginLeft: 15}} className={className} />;

    const LinkedLicenseLabel = (labelProps) =>
        !_.isEmpty(labelProps) &&
        <Link to={Consts.LICENSE_PAGE_PATH} className={className}><LicenseLabel {...labelProps} /></Link>;

    return isCommunity
        ? <LicenseLabel {...labelProps} />
        : <LinkedLicenseLabel {...labelProps} />;
}