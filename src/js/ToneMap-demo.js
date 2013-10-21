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

        var distance = 0;
        var prevPos;

        var loop;
        function startSound (e) {
            e.preventDefault();

            loop = setInterval(function () {
                var playbackRate = Math.max(distance / 50, 0.1);

                toneMap.play('tap', {
                    playbackRate: playbackRate
                });

                distance = 0;
            }, interval);

            prevPos = [
                e.touches ? e.touches[0].pageX : e.pageX,
                e.touches ? e.touches[0].pageY : e.pageY
            ];
        }

        function stopSound (e) {
            e.preventDefault();

            clearInterval(loop);
            loop = null;
            prevPos = [];
        }

        function processPointer (e) {
            e.preventDefault();

            if (!loop) {
                return;
            }

            var pos = [
                e.touches ? e.touches[0].pageX : e.pageX,
                e.touches ? e.touches[0].pageY : e.pageY
            ];

            var dx = pos[0] - prevPos[0];
            var dy = pos[1] - prevPos[1];
            var d = Math.sqrt(dx * dx + dy * dy);

            distance += d;

            prevPos = pos;
        }

        el.addEventListener('mousedown', startSound, false);
        el.addEventListener('mousemove', processPointer, false);
        el.addEventListener('mouseup', stopSound, false);

        el.addEventListener('touchstart', startSound, false);
        el.addEventListener('touchmove', processPointer, false);
        el.addEventListener('touchend', stopSound, false);
    };
}

window.addEventListener('load', init, false);
