/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import React from 'react';

export default function ProductFullName({name, edition}) {
    const fullName = _.join(_.words([name, edition]), ' ');

    return <span style={{color: 'white', verticalAlign: 'middle'}}>{fullName}</span>
}