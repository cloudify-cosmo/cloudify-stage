import type { FunctionComponent } from 'react';
import React from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';
import { getPlaceholderTranslation } from '../common';

const TenantNameValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput
        fetchUrl="/tenants?_include=name"
        placeholder={getPlaceholderTranslation('tenantName')}
        valueProp="name"
        {...props}
    />
);
export default TenantNameValueInput;
