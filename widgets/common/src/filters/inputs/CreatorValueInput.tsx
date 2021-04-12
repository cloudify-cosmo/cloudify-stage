/* eslint-disable react/jsx-props-no-spreading */
import type { FunctionComponent } from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';
import { i18n, i18nPrefix } from '../consts';

const CreatorValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput
        fetchUrl="/users?_include=username"
        placeholder={i18n.t(`${i18nPrefix}.inputsPlaceholders.createdBy`)}
        valueProp="username"
        {...props}
    />
);
export default CreatorValueInput;
