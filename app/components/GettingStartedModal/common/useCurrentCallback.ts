import { useRef } from 'react';

/**
 * Provides hook that lets to call last provided callback.
 * That hook is useful when we want to send some function into hook that was called in previous rendering.
 * e.g.
 * // let's suppose Component is re-rendered many times
 * const Component = ({ onProgress }) => {
 *     const handleProgress = useCurrentCallback(onProgress); // always updates callback inside when re-rendering occurs
 *     // useEffect is called only once when Component was mounted
 *     useEffect(() => {
 *         // some logic here ...
 *         handleProgress(); // calling it we have access to last provided onProgress function
 *     }, []);
 * };
 *
 * @param callback callback that should be used
 * @returns wrapping function for callback that lets to call last provided callback
 */
const useCurrentCallback = (callback?: (...args: any[]) => any) => {
    const reference = useRef(callback);
    reference.current = callback;
    return (...args: any[]) => {
        return reference.current?.(...args);
    };
};

export default useCurrentCallback;
