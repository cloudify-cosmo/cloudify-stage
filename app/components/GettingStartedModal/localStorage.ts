export const isGettingStartedModalDisabledInLocalStorage = (): boolean =>
    localStorage.getItem('getting-started-modal-disabled') === 'true';

export const disableGettingStartedModalInLocalStorage = (): void => {
    localStorage.setItem('getting-started-modal-disabled', 'true');
};
