/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import Consts from '../../utils/consts';

export default function EulaLink() {
    const isCommunity = useSelector(state => _.get(state, 'manager.version.edition') === Consts.EDITION.COMMUNITY);

    return (
        <a
            href={`https://cloudify.co/license${isCommunity ? '-community/' : ''}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            End User License Agreement
        </a>
    );
}
