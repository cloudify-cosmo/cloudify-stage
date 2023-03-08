import { size } from 'lodash';

export function assertIntrinsicFunction(propertyValue: any, intrinsicFunction: string, argument: any) {
    expect(size(propertyValue)).toEqual(1);
    expect(propertyValue[intrinsicFunction]).toEqual(argument);
}

export function assertGetInput(propertyValue: any, argument: any) {
    assertIntrinsicFunction(propertyValue, 'get_input', argument);
}

export function assertGetSecret(propertyValue: any, argument: any) {
    assertIntrinsicFunction(propertyValue, 'get_secret', argument);
}
