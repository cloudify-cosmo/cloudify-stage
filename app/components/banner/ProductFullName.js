/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import React from 'react';

export default function ProductFullName({name, edition, inverted, className = ''}) {
    const fullName = _.join(_.words([name, edition]), ' ');

    return <span style={{color: inverted ? 'black' : 'white', verticalAlign: 'middle'}} className={className}>{fullName}</span>
}