const splashDiv = document.querySelector<HTMLElement>('div.splashPage');
const activeClass = 'active';
const fadeOutSpeed = 300;

export default class SplashLoadingScreen {
    private static fadeOut() {
        if (!splashDiv) {
            throw new Error('Splash page element not found');
        }
        splashDiv.style.setProperty('opacity', '0');
        setTimeout(() => {
            splashDiv.style.removeProperty('opacity');
            splashDiv.style.setProperty('display', 'none');
        }, fadeOutSpeed);
    }

    static turnOn() {
        if (!splashDiv) {
            throw new Error('Splash page element not found');
        }

        if (!splashDiv.classList.contains(activeClass)) {
            splashDiv.style.removeProperty('display');

            splashDiv.classList.add(activeClass);
        }
    }

    static turnOff() {
        if (!splashDiv) {
            throw new Error('Splash page element not found');
        }

        if (splashDiv.classList.contains(activeClass)) {
            SplashLoadingScreen.fadeOut();
            splashDiv.classList.remove(activeClass);
        }
    }
}
