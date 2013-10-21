











ToneMap
======

WebAudioAPI wrapper.

## install

### from bower
```
bower install ToneMap
```

### from github
```javascript
git clone git://github.com/fnobi/ToneMap.git
```

## usage
```
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

        var prevPos;

        var loop;
        function startSound (e) {
            loop = setInterval(function () {
                toneMap.play('tap', {
                    playbackRate: playbackRate
                });
            }, interval);

            prevPos = [
                e.touches ? e.touches[0].pageX : e.pageX,
                e.touches ? e.touches[0].pageY : e.pageY
            ];
        }

        function stopSound () {
            clearInterval(loop);
            loop = null;
            prevPos = [];
        }

        function processPointer (e) {
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

            playbackRate = Math.max(d / 5, 0.1);

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

```
