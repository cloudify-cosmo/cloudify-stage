import * as React from 'react';

export const useIsOverflow = (ref: React.RefObject<any>) => {
    const [isOverflow, setIsOverflow] = React.useState<boolean | undefined>(undefined);

    React.useLayoutEffect(() => {
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
    }, [ref]);

    return isOverflow;
};
