WL.registerComponent('pp-mute-all', {
}, {
    init: function () {
    },
    start: function () {
        Howler.mute(true);
    },
    update: function (dt) {
    },
});