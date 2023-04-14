import * as React from 'react';

/**
 * For HTML element defined by RefObject returns boolean variable indicating if an element's content has overflow
 *
 * Inspired by: https://www.robinwieruch.de/react-custom-hook-check-if-overflow/
 */
export const useIsOverflow = (ref: React.RefObject<any>) => {
    const [isOverflow, setIsOverflow] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        const { current } = ref;

        const trigger = () => {
            const hasOverflow = current.scrollHeight > current.offsetHeight;
            setIsOverflow(hasOverflow);
        };

        if (current) {
            if ('ResizeObserver' in window) {
                new ResizeObserver(trigger).observe(current);
            }

            trigger();
        }
    }, [ref, ref?.current?.innerText]);

    return isOverflow;
};
