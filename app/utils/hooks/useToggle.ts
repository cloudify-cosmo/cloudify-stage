import { useState } from 'react';

/**
 * Returns a stateful boolean value and one function to toggle it
 */
export default function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    return [value, () => setValue(!value)] as const;
}
