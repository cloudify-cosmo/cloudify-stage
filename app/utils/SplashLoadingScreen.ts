const SPLASH_DIV: HTMLElement | null = document.querySelector('div.splashPage');
const ACTIVE_CLASS = 'active';
const FADE_OUT_SPEED = 300;

export default class SplashLoadingScreen {
    static fadeOut(element: HTMLElement) {
        element.style.setProperty('transition', `all ${FADE_OUT_SPEED}ms linear`);
        element.style.setProperty('opacity', '0');
        setTimeout(() => {
            element.style.removeProperty('transition');
            element.style.removeProperty('opacity');
            element.style.setProperty('display', 'none');
        }, FADE_OUT_SPEED);
    }

    static turnOn() {
        if (SPLASH_DIV && !SPLASH_DIV.classList.contains(ACTIVE_CLASS)) {
            SPLASH_DIV.style.removeProperty('display');

            SPLASH_DIV.classList.add(ACTIVE_CLASS);
        }
    }

    static turnOff() {
        if (SPLASH_DIV && SPLASH_DIV.classList.contains(ACTIVE_CLASS)) {
            SplashLoadingScreen.fadeOut(SPLASH_DIV);
            SPLASH_DIV.classList.remove(ACTIVE_CLASS);
        }
    }
}
