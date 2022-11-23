import { Howler } from 'howler';

WL.registerComponent('pp-mute-everything', {
}, {
    init: function () {
    },
    start: function () {
        Howler.mute(true);
    },
    update: function (dt) {
    },
});