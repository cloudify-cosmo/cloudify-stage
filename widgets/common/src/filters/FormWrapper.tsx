import { FunctionComponent } from 'react';

const { Form } = Stage.Basic;

// TODO: This wrapper should be unified with unsafelyTypedForm.tsx and probably added to `app/components/basic`
export default (Form as unknown) as FunctionComponent<{ [x: string]: any }>;
export const FormField = (Form.Field as unknown) as FunctionComponent<{ [x: string]: any }>;
export const FormGroup = (Form.Group as unknown) as FunctionComponent<{ [x: string]: any }>;
