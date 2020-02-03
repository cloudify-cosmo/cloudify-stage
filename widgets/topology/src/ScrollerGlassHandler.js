export default class ScrollerGlassHandler {
    constructor(glassRef) {
        this.glassRef = glassRef;
    }

    releaseScroller = () => {
        this.isMouseOver = true;
        $(this.glassRef.current).addClass('unlocked');
    };

    timerReleaseScroller = () => {
        this.isMouseOver = true;
        setTimeout(() => {
            if (this.isMouseOver) {
                this.releaseScroller();
            }
        }, 3000);
    };

    reactivateScroller = () => {
        this.isMouseOver = false;
        $(this.glassRef.current).removeClass('unlocked');
    };
}
