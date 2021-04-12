/* eslint-disable react/jsx-props-no-spreading */
import type { FunctionComponent } from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';

const BlueprintValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput
        fetchUrl="/blueprints?state=uploaded&_include=id"
        placeholder="Blueprint IDs"
        valueProp="id"
        {...props}
    />
);

export default BlueprintValueInput;
