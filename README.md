











ToneMap
======

WebAudioAPI wrapper.

## install

### from bower
```
bower install ToneMap
```

### from github
```
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

        var interval = 100;
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

        el.addEventListener('mousedown', function () {
            startSound();
        }, false);

        el.addEventListener('mouseup', function () {
            stopSound();
        }, false);
    };
}

window.addEventListener('load', init, false);

```
