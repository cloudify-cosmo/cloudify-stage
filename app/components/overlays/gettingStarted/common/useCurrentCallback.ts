import { useRef } from 'react';

/**
 * Provides a hook that lets you to call the last provided callback.
 * That hook is useful when you want to send into hook a function that was called in the previous rendering.
 * e.g.
 * // let's suppose Component is re-rendered many times
 * const Component = ({ onProgress }) => {
 *     const handleProgress = useCurrentCallback(onProgress); // always updates the callback inside when re-rendering occurs
 *     // useEffect is called only once when Component was mounted
 *     useEffect(() => {
 *         // some logic here ...
 *         handleProgress(); // calling it we have an access to the last provided onProgress function
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
