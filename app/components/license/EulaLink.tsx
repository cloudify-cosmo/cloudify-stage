/**
 * Created by jakub.niezgoda on 15/03/2019.
 */
import i18n from 'i18next';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import Consts from '../../utils/consts';

export default function EulaLink() {
    const isCommunity = useSelector(state => _.get(state, 'manager.version.edition') === Consts.EDITION.COMMUNITY);

    return (
        <a
            href={i18n.t(`licenseManagement.eulaLink${isCommunity ? 'Community' : ''}`)}
            target="_blank"
            rel="noopener noreferrer"
        >
            {i18n.t('licenseManagement.eula', 'End User License Agreement')}
        </a>
    );
}
