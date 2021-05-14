import React from 'react';
import { Icon } from 'semantic-ui-react';

const iconStyle = { marginLeft: '0.5em', verticalAlign: 'middle', display: 'inline-block' };

export const SuccessIcon = () => <Icon style={iconStyle} color="green" name="check" />;
export const ErrorIcon = () => <Icon style={iconStyle} color="red" name="remove" />;
export const ProcessingIcon = () => <Icon style={iconStyle} color="grey" name="spinner" loading />;
