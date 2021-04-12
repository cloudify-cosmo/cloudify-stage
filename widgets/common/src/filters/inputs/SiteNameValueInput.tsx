/* eslint-disable react/jsx-props-no-spreading */
import type { FunctionComponent } from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';

const SiteNameValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput fetchUrl="/sites?_include=name" placeholder="Site names" valueProp="name" {...props} />
);

export default SiteNameValueInput;
