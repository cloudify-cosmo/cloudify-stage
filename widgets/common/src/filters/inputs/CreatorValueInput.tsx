/* eslint-disable react/jsx-props-no-spreading */
import type { FunctionComponent } from 'react';
import type { CommonAttributeValueInputProps } from './types';
import AttributeValueInput from './AttributeValueInput';

const CreatorValueInput: FunctionComponent<CommonAttributeValueInputProps> = props => (
    <AttributeValueInput fetchUrl="/users?_include=username" placeholder="Usernames" valueProp="username" {...props} />
);

export default CreatorValueInput;
