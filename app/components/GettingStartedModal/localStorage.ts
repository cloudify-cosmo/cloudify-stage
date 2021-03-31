export const isGettingStartedModalDisabledInLocalStorage = (): boolean => {
    const modalDisabled = localStorage.getItem('getting-started-modal-disabled');
    return modalDisabled === undefined || modalDisabled !== 'true';
};

export const disableGettingStartedModalInLocalStorage = (): void => {
    localStorage.setItem('getting-started-modal-disabled', 'true');
};
