WL.registerComponent("pp-audio-manager", {
}, {
    init: function () {
        PP.myAudioManager = new PP.AudioManagerClass();
    },
    start: function () {
    },
    update: function (dt) {
    }
});

PP.myAudioManager = null;