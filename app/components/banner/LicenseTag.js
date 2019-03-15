/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import React from 'react';
import {Link} from 'react-router-dom';

import {Label} from '../basic';
import Consts from '../../utils/consts';

export default function LicenseTag({isCommunity, isExpired, isTrial}) {
    const labelProps
        = isCommunity
        ? {content: 'Community License', color: 'gray'}
        : isExpired
            ? {content: 'Expired License', color: 'red'}
            : isTrial
                ? {content: 'Trial License', color: 'orange'}
                : {};

    const LicenseLabel = (labelProps) =>
        <Label {...labelProps} style={{marginLeft: 20, verticalAlign: 'middle'}} />;

    const LinkedLicenseLabel = (labelProps) =>
        !_.isEmpty(labelProps) &&
        <Link to={Consts.LICENSE_PAGE_PATH}><LicenseLabel {...labelProps} /></Link>;

    return isCommunity
        ? <LicenseLabel {...labelProps} />
        : <LinkedLicenseLabel {...labelProps} />;
}