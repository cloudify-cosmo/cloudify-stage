import React, { FormEvent, forwardRef, memo, ReactNode, Ref, RefObject, useRef } from 'react';
import { Form, Ref as SemanticRef } from 'semantic-ui-react';
import { bindFormData, getFormData } from './formUtils';

type Props<T extends unknown> = {
    data?: T;
    children: ReactNode;
    onSubmit?: (data: T) => void;
};

const UncontrolledForm = <T extends unknown>({ data, children, onSubmit }: Props<T>, ref: Ref<HTMLFormElement>) => {
    const formRef = (ref as RefObject<HTMLFormElement>) ?? useRef<HTMLFormElement>(null);
    React.useEffect(() => {
        if ('current' in formRef) {
            const form = formRef.current;
            if (form) {
                bindFormData(form, data ?? {});
            }
        } else {
            throw new Error('Required object reference.');
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
            <Form onSubmit={handleSubmit}>{children}</Form>
        </SemanticRef>
    );
};

type UncontrolledForm = <T extends unknown>(props: Props<T> & { ref?: Ref<HTMLFormElement> }) => JSX.Element;

export default memo(forwardRef(UncontrolledForm)) as UncontrolledForm;
