import type { FunctionComponent } from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';
import { getPlaceholderTranslation } from '../common';

const CreatorValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput
        fetchUrl="/users?_include=username"
        placeholder={getPlaceholderTranslation('createdBy')}
        valueProp="username"
        {...props}
    />
);
export default CreatorValueInput;
