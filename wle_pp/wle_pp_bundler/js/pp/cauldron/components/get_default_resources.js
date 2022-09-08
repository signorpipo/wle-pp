WL.registerComponent('pp-get-default-resources', {
    _myPlane: { type: WL.Type.Mesh },
    _myCube: { type: WL.Type.Mesh },
    _mySphere: { type: WL.Type.Mesh },
    _myCone: { type: WL.Type.Mesh },
    _myCylinder: { type: WL.Type.Mesh },
    _myCircle: { type: WL.Type.Mesh },

    _myFlatOpaque: { type: WL.Type.Material },
    _myPhongOpaque: { type: WL.Type.Material },
    _myText: { type: WL.Type.Material },

}, {
    init() {
        PP.myDefaultResources.myMeshes.myPlane = PP.MeshUtils.cloneMesh(this._myPlane);
        PP.myDefaultResources.myMeshes.myCube = PP.MeshUtils.cloneMesh(this._myCube);
        PP.myDefaultResources.myMeshes.mySphere = PP.MeshUtils.cloneMesh(this._mySphere);
        PP.myDefaultResources.myMeshes.myCone = PP.MeshUtils.cloneMesh(this._myCone);
        PP.myDefaultResources.myMeshes.myCylinder = PP.MeshUtils.cloneMesh(this._myCylinder);
        PP.myDefaultResources.myMeshes.myCircle = PP.MeshUtils.cloneMesh(this._myCircle);

        PP.myDefaultResources.myMaterials.myFlatOpaque = this._myFlatOpaque.clone();
        PP.myDefaultResources.myMaterials.myPhongOpaque = this._myPhongOpaque.clone();
        PP.myDefaultResources.myMaterials.myText = this._myText.clone();
    }
});

PP.myDefaultResources = {
    myMeshes: {
        myPlane: null,
        myCube: null,
        mySphere: null,
        myCone: null,
        myCylinder: null,
        myCircle: null
    },
    myMaterials: {
        myFlatOpaque: null,
        myPhongOpaque: null,
        myText: null
    }
};