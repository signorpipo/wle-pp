WL.registerComponent("pp-clear-console-on-xr-session-start", {
}, {
    init: function () {
    },
    start: function () {
        this._myFirstTime = true;
        WL.onXRSessionStart.push(function () {
            if (this._myFirstTime) {
                this._myFirstTime = false;
                console.clear();
            }
        }.bind(this));
    },
    update: function (dt) {
    }
});