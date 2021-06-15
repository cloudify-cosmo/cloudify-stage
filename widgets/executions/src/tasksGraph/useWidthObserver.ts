import { useEffect, useRef, useState } from 'react';

export default function useWidthObserver() {
    const observedElementRef = useRef<HTMLElement>();
    // Used to force component rerender - the actual state variable is not used
    const [_wrapperWidth, setWrapperWidth] = useState<number>();
    const wrapperResizeObserver = useRef(
        new ResizeObserver(() => setWrapperWidth(observedElementRef.current?.offsetWidth))
    );

    useEffect(() => {
        const wrapperRef = observedElementRef.current;

        if (!wrapperRef) return undefined;

        wrapperResizeObserver.current.observe(wrapperRef);
        return () => wrapperResizeObserver.current.unobserve(wrapperRef);
    }, [observedElementRef.current]);

    function getElementWidth() {
        return observedElementRef.current?.offsetWidth ?? 0;
    }

    return [observedElementRef, getElementWidth];
}
