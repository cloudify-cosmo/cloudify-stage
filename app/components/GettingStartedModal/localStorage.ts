export const getGettingStartedModalDisabled = (): boolean => {
    const modalDisabled = localStorage.getItem('getting-started-modal-disabled');
    return modalDisabled === undefined || modalDisabled !== 'true';
};

export const setGettingStartedModalDisabled = (modalDisabled: boolean): void => {
    localStorage.setItem('getting-started-modal-disabled', String(modalDisabled));
};
