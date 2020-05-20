/**
 * Created by pawelposel on 2017-06-09.
 */

exports.command = function(callback) {
    return this.perform((client, done) => {
        console.log('press to continue');
        let pressed = false;
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', listener);
        pause();

        function listener() {
            process.stdin.removeListener('keypress', listener);
            process.stdin.pause();
            pressed = true;
        }

        function pause() {
            client.pause(10, () => {
                if (!pressed) return pause();
                done();
            });
        }
    });
};
