import React, { forwardRef, memo, useRef } from 'react';
import { Form, Ref as SemanticRef } from 'semantic-ui-react';

import type { FormEvent, ReactNode, Ref, RefObject } from 'react';

import { bindFormData, getFormData } from './formUtils';

type Props<T extends unknown> = {
    loading?: boolean;
    data?: T;
    children: ReactNode;
    onSubmit?: (data: T) => void;
};

const UncontrolledForm = <T extends unknown>(
    { loading, data, children, onSubmit }: Props<T>,
    ref: Ref<HTMLFormElement>
) => {
    const formRef = (ref as RefObject<HTMLFormElement>) ?? useRef<HTMLFormElement>(null);
    React.useEffect(() => {
        if ('current' in formRef) {
            const form = formRef.current;
            if (form) {
                bindFormData(form, data ?? {});
            }
        } else {
            throw new Error('Required RefObject<HTMLFormElement> type ref property.');
        }
    }, [data]);
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (onSubmit && formRef.current) {
            onSubmit(getFormData(formRef.current));
        }
    };
    return (
        <SemanticRef innerRef={formRef}>
            <Form loading={loading} onSubmit={handleSubmit}>
                {children}
            </Form>
        </SemanticRef>
    );
};

type UncontrolledForm = <T extends unknown>(props: Props<T> & { ref?: Ref<HTMLFormElement> }) => JSX.Element;

export default memo(forwardRef(UncontrolledForm)) as UncontrolledForm;
