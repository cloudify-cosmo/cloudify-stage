export const isGettingStartedModalDisabled = (): boolean =>
    localStorage.getItem('getting-started-modal-disabled') === 'true';

export const disableGettingStartedModal = (): void => {
    localStorage.setItem('getting-started-modal-disabled', 'true');
};
