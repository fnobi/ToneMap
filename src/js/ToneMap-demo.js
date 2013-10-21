function init () {
    // init toneMap
    var toneMap = new ToneMap({
        tap: '/sounds/tap.wav'
    });

    // wait loading buffer
    toneMap.on('load', initTouchEvent);
    toneMap.load();

    // init player
    function initTouchEvent () {
        var el = document.getElementById('wrapper');

        var interval = 50;
        var playbackRate = 1.0;

        var loop;
        function startSound () {
            loop = setInterval(function () {
                toneMap.play('tap', {
                    playbackRate: playbackRate
                });
            }, interval);
        }

        function stopSound () {
            clearInterval(loop);
        }

        el.addEventListener('mousedown', startSound, false);
        el.addEventListener('mouseup', stopSound, false);

        el.addEventListener('touchstart', startSound, false);
        el.addEventListener('touchend', stopSound, false);
    };
}

window.addEventListener('load', init, false);
