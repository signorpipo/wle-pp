WL.registerComponent('pp-debug-manager', {
    _myCubeMesh: { type: WL.Type.Mesh },
    _myConeMesh: { type: WL.Type.Mesh },
    _myFlatMaterial: { type: WL.Type.Material },
}, {
    init: function () {
    },
    start() {
        PP.myDebugData.myRootObject = WL.scene.addObject(null);
        PP.myDebugData.myCubeMesh = this._myCubeMesh;
        PP.myDebugData.myConeMesh = this._myConeMesh;
        PP.myDebugData.myFlatMaterial = this._myFlatMaterial.clone();

        PP.myDebugManager = new PP.DebugManager();
    },
    update(dt) {
        PP.myDebugManager.update(dt);
    }
});

PP.myDebugManager = null;

PP.myDebugData = {
    myRootObject: null,
    myCubeMesh: null,
    myConeMesh: null,
    myFlatMaterial: null
};