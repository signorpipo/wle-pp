PP.TextUtils = {
    setClonedMaterials: function (object) {
        let textComponents = object.pp_getComponentsHierarchy("text");

        for (let textComponent of textComponents) {
            textComponent.material = textComponent.material.clone();
        }
    },
};