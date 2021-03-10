import { useState } from 'react';

/**
 * Returns a stateful boolean value and two functions - one to set the value to `true` and another one to set it to `false`
 */
export default function useBoolean(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    return [value, () => setValue(true), () => setValue(false)] as const;
}
