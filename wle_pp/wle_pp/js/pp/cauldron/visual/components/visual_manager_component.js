WL.registerComponent('pp-visual-manager', {
}, {
    init: function () {
        if (this.active) {
            PP.myVisualData.myRootObject = WL.scene.addObject(null);

            PP.myVisualManager = new PP.VisualManager();
        }
    },
    start() {
        PP.myVisualData.myDefaultMaterials.myDefaultMeshMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();

        PP.myVisualData.myDefaultMaterials.myDefaultTextMaterial = PP.myDefaultResources.myMaterials.myText.clone();

        PP.myVisualData.myDefaultMaterials.myDefaultRightMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
        PP.myVisualData.myDefaultMaterials.myDefaultRightMaterial.color = PP.vec4_create(1, 0, 0, 1);
        PP.myVisualData.myDefaultMaterials.myDefaultUpMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
        PP.myVisualData.myDefaultMaterials.myDefaultUpMaterial.color = PP.vec4_create(0, 1, 0, 1);
        PP.myVisualData.myDefaultMaterials.myDefaultForwardMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
        PP.myVisualData.myDefaultMaterials.myDefaultForwardMaterial.color = PP.vec4_create(0, 0, 1, 1);

        PP.myVisualData.myDefaultMaterials.myDefaultRayMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
        PP.myVisualData.myDefaultMaterials.myDefaultRayMaterial.color = PP.vec4_create(0, 1, 0, 1);
        PP.myVisualData.myDefaultMaterials.myDefaultHitNormalMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
        PP.myVisualData.myDefaultMaterials.myDefaultHitNormalMaterial.color = PP.vec4_create(1, 0, 0, 1);

        PP.myVisualManager.start();
    },
    update(dt) {
        PP.myVisualManager.update(dt);
    }
});

PP.myVisualManager = null;

PP.myVisualData = {
    myRootObject: null,
    myDefaultMaterials: {
        myDefaultMeshMaterial: null,
        myDefaultTextMaterial: null,
        myDefaultRightMaterial: null,
        myDefaultUpMaterial: null,
        myDefaultForwardMaterial: null,
        myDefaultRayMaterial: null,
        myDefaultHitNormalMaterial: null
    }
};