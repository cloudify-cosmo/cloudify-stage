import { useState } from 'react';

/**
 * Like `useState`, but allows to reset the value back to the initial one using function returned as the third array element.
 */
export default function useResettableState<T>(initialValue: T) {
    const [value, setValue] = useState(initialValue);

    return [value, setValue, () => setValue(initialValue)] as const;
}
