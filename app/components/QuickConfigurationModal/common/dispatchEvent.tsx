const dispatchEvent = (element: HTMLElement, eventName: string) => {
    const eventArg = document.createEvent('HTMLEvents');
    const eventAction = (element as any)[`on${eventName}`];
    if (eventAction) {
        eventAction.apply(element, eventArg);
    }
    if ('createEvent' in document) {
        eventArg.initEvent(eventName, false, true);
        element.dispatchEvent(eventArg);
    } else {
        (element as any).fireEvent(eventName); // only for backward capability
    }
};

export default dispatchEvent;
