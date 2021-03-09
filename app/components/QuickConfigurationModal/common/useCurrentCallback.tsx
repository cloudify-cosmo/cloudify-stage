import { useRef } from 'react';

const useCurrentCallback = (callback?: (...args: any[]) => any) => {
    const reference = useRef(callback);
    reference.current = callback;
    return (...args: any[]) => {
        return reference.current?.(...args);
    };
};

export default useCurrentCallback;
