WL.registerComponent('pp-debug-data', {
    _myCubeMesh: { type: WL.Type.Mesh },
    _myFlatMaterial: { type: WL.Type.Material },
}, {
    init: function () {
        PP.myDebugData.myRootObject = WL.scene.addObject(null);

        PP.myDebugData.myCubeMesh = this._myCubeMesh;
        PP.myDebugData.myFlatMaterial = this._myFlatMaterial;
    },
});

PP.myDebugData = {
    myRootObject: null,
    myCubeMesh: null,
    myFlatMaterial: null
};