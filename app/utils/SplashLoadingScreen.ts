import log from 'loglevel';

const splashDiv = document.querySelector<HTMLElement>('div.splashPage');
const activeClass = 'active';
const fadeOutSpeed = 300;

export default class SplashLoadingScreen {
    private static assertSplashExists(div?: any): asserts div {
        if (!div) {
            throw new Error('Splash page element not found');
        }
    }

    private static fadeOut() {
        try {
            SplashLoadingScreen.assertSplashExists(splashDiv);

            splashDiv.style.setProperty('opacity', '0');
            setTimeout(() => {
                splashDiv.style.removeProperty('opacity');
                splashDiv.style.setProperty('display', 'none');
            }, fadeOutSpeed);
        } catch (e) {
            log.error(e);
        }
    }

    static turnOn() {
        try {
            SplashLoadingScreen.assertSplashExists(splashDiv);

            if (!splashDiv.classList.contains(activeClass)) {
                splashDiv.style.removeProperty('display');

                splashDiv.classList.add(activeClass);
            }
        } catch (e) {
            log.error(e);
        }
    }

    static turnOff() {
        try {
            SplashLoadingScreen.assertSplashExists(splashDiv);

            if (splashDiv.classList.contains(activeClass)) {
                SplashLoadingScreen.fadeOut();
                splashDiv.classList.remove(activeClass);
            }
        } catch (e) {
            log.error(e);
        }
    }
}
