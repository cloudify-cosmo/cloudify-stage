/* eslint-disable react/jsx-props-no-spreading */
import type { FunctionComponent } from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';
import { i18n, i18nPrefix } from '../consts';

const SiteNameValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput
        fetchUrl="/sites?_include=name"
        placeholder={i18n.t(`${i18nPrefix}.inputsPlaceholders.siteName`)}
        valueProp="name"
        {...props}
    />
);

export default SiteNameValueInput;
