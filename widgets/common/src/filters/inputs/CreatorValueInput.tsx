/* eslint-disable react/jsx-props-no-spreading */
import type { FunctionComponent } from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';
import { i18n, i18nPlaceholdersPrefix } from '../consts';

const CreatorValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput
        fetchUrl="/users?_include=username"
        placeholder={i18n.t(`${i18nPlaceholdersPrefix}.createdBy`)}
        valueProp="username"
        {...props}
    />
);
export default CreatorValueInput;
