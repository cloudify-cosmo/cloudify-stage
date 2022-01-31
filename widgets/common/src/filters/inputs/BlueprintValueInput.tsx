import type { FunctionComponent } from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';
import { getPlaceholderTranslation } from '../common';

const BlueprintValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput
        fetchUrl="/blueprints?state=uploaded&_include=id"
        placeholder={getPlaceholderTranslation('blueprintId')}
        valueProp="id"
        {...props}
    />
);

export default BlueprintValueInput;
