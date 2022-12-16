WL.registerComponent("pp-audio-manager", {
}, {
    init() {
        PP.myAudioManager = new PP.AudioManagerClass();
    },
    start() {
    },
    update(dt) {
    }
});

PP.myAudioManager = null;