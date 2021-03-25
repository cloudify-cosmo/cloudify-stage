import type { FC } from 'react';

import { Form } from '../basic';

// TODO(RD-1837): remove it after forms will be changed to tsx version
export const UnsafelyTypedForm = (Form as unknown) as FC<{ [x: string]: any }>;

// TODO(RD-1837): remove it after forms will be changed to tsx version
export const UnsafelyTypedFormField = (Form.Field as unknown) as FC<{ [x: string]: any }>;
