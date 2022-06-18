WL.registerComponent('pp-debug-manager', {
    _myCubeMesh: { type: WL.Type.Mesh },
    _mySphereMesh: { type: WL.Type.Mesh },
    _myConeMesh: { type: WL.Type.Mesh },
    _myFlatMaterial: { type: WL.Type.Material },
}, {
    init: function () {
        if (this.active) {
            PP.myDebugData.myRootObject = WL.scene.addObject(null);
            PP.myDebugData.myCubeMesh = this._myCubeMesh;
            PP.myDebugData.mySphereMesh = this._mySphereMesh;
            PP.myDebugData.myConeMesh = this._myConeMesh;
            PP.myDebugData.myFlatMaterial = this._myFlatMaterial.clone();

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
    myRootObject: null,
    myCubeMesh: null,
    mySphereMesh: null,
    myConeMesh: null,
    myFlatMaterial: null
};