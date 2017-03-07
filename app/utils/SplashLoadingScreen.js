/**
 * Created by jakubniezgoda on 06/13/2017.
 */

const SPLASH_DIV = $('div#splash');
const ACTIVE_CLASS = 'active';
const FADE_OUT_SPEED = 'slow';

export default class SplashLoadingScreen {

    static turnOn() {
        if (!SPLASH_DIV.hasClass(ACTIVE_CLASS)) {
            SPLASH_DIV.show();
            SPLASH_DIV.addClass(ACTIVE_CLASS);
        }
    };

    static turnOff() {
        if (SPLASH_DIV.hasClass(ACTIVE_CLASS)) {
            SPLASH_DIV.fadeOut(FADE_OUT_SPEED);
            SPLASH_DIV.removeClass(ACTIVE_CLASS);
        }
    };
}