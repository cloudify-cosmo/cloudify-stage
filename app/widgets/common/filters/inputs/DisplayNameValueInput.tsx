import type { FunctionComponent } from 'react';
import React from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';
import { getPlaceholderTranslation } from '../common';

const DisplayNameValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput
        fetchUrl="/deployments?_include=display_name"
        placeholder={getPlaceholderTranslation('displayName')}
        valueProp="display_name"
        {...props}
    />
);
export default DisplayNameValueInput;
