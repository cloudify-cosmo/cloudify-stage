export const isGettingStartedModalDisabled = (): boolean => {
    const modalDisabled = localStorage.getItem('getting-started-modal-disabled');
    return modalDisabled === undefined || modalDisabled !== 'true';
};

export const disableGettingStartedModal = (): void => {
    localStorage.setItem('getting-started-modal-disabled', 'true');
};
