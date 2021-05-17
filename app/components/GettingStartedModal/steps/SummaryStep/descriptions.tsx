import React from 'react';
import { ErrorIcon, ProcessingIcon, SuccessIcon } from '../../common/icons';

type Props = {
    message: string;
};

export const SuccessDescription = ({ message }: Props) => (
    <>
        {message}
        <SuccessIcon />
    </>
);

export const ProcessingDescription = ({ message }: Props) => (
    <>
        {message}
        <ProcessingIcon />
    </>
);

export const ErrorDescription = ({ message }: Props) => (
    <>
        {message}
        <ErrorIcon />
    </>
);
