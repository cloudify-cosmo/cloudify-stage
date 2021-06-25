import { useEffect, useMemo, useRef, useState } from 'react';

export default function useWidthObserver() {
    const observedElementRef = useRef<HTMLDivElement>(null);
    // Used to force component rerender - the actual state variable is not used
    const [_wrapperWidth, setWrapperWidth] = useState<number>();
    const wrapperResizeObserver = useMemo(
        () => new ResizeObserver(() => setWrapperWidth(observedElementRef.current?.offsetWidth)),
        []
    );

    useEffect(() => {
        const wrapperRef = observedElementRef.current;

        if (!wrapperRef) return undefined;

        wrapperResizeObserver.observe(wrapperRef);
        return () => wrapperResizeObserver.unobserve(wrapperRef);
    }, [observedElementRef.current]);

    function getElementWidth() {
        return observedElementRef.current?.offsetWidth ?? 0;
    }

    return [observedElementRef, getElementWidth] as const;
}
