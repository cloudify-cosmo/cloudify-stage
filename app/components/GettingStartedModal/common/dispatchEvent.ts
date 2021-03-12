const dispatchEvent = (element: HTMLElement, eventName: string) => {
    if ('createEvent' in document) {
        const event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, false, true);
        element.dispatchEvent(event);
    } else {
        (element as any).fireEvent(eventName); // only for backward capability
    }
};

export default dispatchEvent;
