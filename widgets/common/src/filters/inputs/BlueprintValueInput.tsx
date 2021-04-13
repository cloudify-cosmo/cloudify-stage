/* eslint-disable react/jsx-props-no-spreading */
import type { FunctionComponent } from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';
import { i18n, i18nPlaceholdersPrefix } from '../consts';

const BlueprintValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput
        fetchUrl="/blueprints?state=uploaded&_include=id"
        placeholder={i18n.t(`${i18nPlaceholdersPrefix}.blueprintId`)}
        valueProp="id"
        {...props}
    />
);

export default BlueprintValueInput;
