import type { FunctionComponent } from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';
import { getPlaceholderTranslation } from '../common';

const SiteNameValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput
        fetchUrl="/sites?_include=name"
        placeholder={getPlaceholderTranslation('siteName')}
        valueProp="name"
        {...props}
    />
);

export default SiteNameValueInput;
