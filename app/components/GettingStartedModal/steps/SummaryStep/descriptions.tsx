import React from 'react';
import { ErrorIcon, ProcessingIcon, SuccessIcon } from '../../common/icons';

type Props = {
    message: string;
};

export const SuccessDescription = ({ message }: Props) => (
    <>
        <span>{message}</span>
        <SuccessIcon />
    </>
);

export const ProcessingDescription = ({ message }: Props) => (
    <>
        <span>{message}</span>
        <ProcessingIcon />
    </>
);

export const ErrorDescription = ({ message }: Props) => (
    <>
        <span>{message}</span>
        <ErrorIcon />
    </>
);
