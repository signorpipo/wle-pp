WL.registerComponent('pp-debug-manager', {
}, {
    init: function () {
        if (this.active) {
            PP.myDebugData.myRootObject = WL.scene.addObject(null);

            PP.myDebugManager = new PP.DebugManager();
        }
    },
    start() {
    },
    update(dt) {
        PP.myDebugManager.update(dt);
    }
});

PP.myDebugManager = null;

PP.myDebugData = {
    myRootObject: null
};