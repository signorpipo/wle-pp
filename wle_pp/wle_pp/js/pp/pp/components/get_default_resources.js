WL.registerComponent('pp-get-default-resources', {
    _myPlane: { type: WL.Type.Mesh },
    _myCube: { type: WL.Type.Mesh },
    _mySphere: { type: WL.Type.Mesh },
    _myCone: { type: WL.Type.Mesh },
    _myCylinder: { type: WL.Type.Mesh },
    _myCircle: { type: WL.Type.Mesh },

    _myFlatOpaque: { type: WL.Type.Material },
    _myFlatTransparentNoDepth: { type: WL.Type.Material },
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

        PP.myDefaultResources.myMeshes.myInvertedCube = PP.MeshUtils.invertMesh(this._myCube);
        PP.myDefaultResources.myMeshes.myInvertedSphere = PP.MeshUtils.invertMesh(this._mySphere);
        PP.myDefaultResources.myMeshes.myInvertedCone = PP.MeshUtils.invertMesh(this._myCone);
        PP.myDefaultResources.myMeshes.myInvertedCylinder = PP.MeshUtils.invertMesh(this._myCylinder);

        if (this._myFlatOpaque != null) {
            PP.myDefaultResources.myMaterials.myFlatOpaque = this._myFlatOpaque.clone();
        }

        if (this._myFlatTransparentNoDepth != null) {
            PP.myDefaultResources.myMaterials.myFlatTransparentNoDepth = this._myFlatTransparentNoDepth.clone();
        }

        if (this._myPhongOpaque != null) {
            PP.myDefaultResources.myMaterials.myPhongOpaque = this._myPhongOpaque.clone();
        }

        if (this._myText != null) {
            PP.myDefaultResources.myMaterials.myText = this._myText.clone();
        }
    }
});

PP.myDefaultResources = {
    myMeshes: {
        myPlane: null,
        myCube: null,
        mySphere: null,
        myCone: null,
        myCylinder: null,
        myCircle: null,

        myInvertedCube: null,
        myInvertedSphere: null,
        myInvertedCone: null,
        myInvertedCylinder: null
    },
    myMaterials: {
        myFlatOpaque: null,
        myFlatTransparentNoDepth: null, // for now the pipeline needs to be the last one to make this work properly
        myPhongOpaque: null,
        myText: null,
    }
};