(function (win) {
    var ToneMap = function (soundPaths) {
        this.soundPaths = soundPaths || {};
        this.initContext();
    };
    inherits(ToneMap, EventEmitter);

    ToneMap.prototype.initContext = function () {
        var AudioContext = getAudioContext();
        var context = new AudioContext();
        this.context = context;
    };

    ToneMap.prototype.load = function () {
        var self = this;

        var soundPaths = this.soundPaths;
        var context = this.context;

        var buffers = {};

        var sounds = [];
        for (var name in soundPaths) {
            sounds.push({
                name: name,
                path: soundPaths[name]
            });
        }

        var loaded = 0;
        function progressLoading () {
            loaded++;
            if (sounds.length <= loaded) {
                self.buffers = buffers;
                self.emit('load');
            }
        }

        sounds.forEach(function (sound) {
            requestArrayBuffer(sound.path, function (res) {
                context.decodeAudioData(res, function (buf) {
                    buffers[sound.name] = buf;
                    progressLoading();
                });
            });
        });
    };

    ToneMap.prototype.play = function (name, opts) {
        opts = opts || {};

        var context = this.context;
        var buffer = this.buffers[name];

        if (!buffer) {
            throw Error('buffer "' + name + '" is not found!');
        }

        var source = context.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.value = opts.playbackRate || 1.0;
        source.connect(context.destination);
        source.noteOn(0);
    };
    


    // short libraries

    var getAudioContext = function () {
        try {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            return AudioContext;
        } catch(e) {
            alert('Web Audio API is not supported in this browser');
        }
    };

    var async = function (fns) {
        (function exec (index) {
            if (!fns[index]) {
                return;
            }
            fns[index](function () {
                exec(index + 1);
            });
        })(0);
    };

    var requestArrayBuffer = function (path, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        
        request.send();
        request.onload = function () {
            callback(request.response);
        };
    };

    win.ToneMap = ToneMap;
})(window);
