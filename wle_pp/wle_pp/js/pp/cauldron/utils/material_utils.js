PP.MaterialUtils = {
    setAlpha: function () {
        let color = PP.vec4_create();
        return function setAlpha(material, alpha) {
            if (material.color != null) {
                color.vec4_copy(material.color);
                color[3] = alpha;
                material.color = color;
            }

            if (material.diffuseColor != null) {
                color.vec4_copy(material.diffuseColor);
                color[3] = alpha;
                material.diffuseColor = color;
            }

            if (material.ambientColor != null) {
                color.vec4_copy(material.ambientColor);
                color[3] = alpha;
                material.ambientColor = color;
            }
        };
    }(),
    setObjectAlpha: function (object, alpha) {
        let meshComponents = object.pp_getComponentsHierarchy("mesh");

        for (let meshComponent of meshComponents) {
            if (meshComponent.material != null) {
                PP.MaterialUtils.setAlpha(meshComponent.material, alpha);
            }
        }
    },
    setObjectMaterial: function (object, material, cloneMaterial = false) {
        let meshComponents = object.pp_getComponentsHierarchy("mesh");

        for (let meshComponent of meshComponents) {
            if (cloneMaterial) {
                meshComponent.material = material.clone();
            } else {
                meshComponent.material = material;
            }
        }
    },
    setObjectClonedMaterials: function (object) {
        let meshComponents = object.pp_getComponentsHierarchy("mesh");

        for (let meshComponent of meshComponents) {
            meshComponent.material = meshComponent.material.clone();
        }
    },
    setObjectSpecularColor: function (object, color) {
        let meshComponents = object.pp_getComponentsHierarchy("mesh");

        for (let meshComponent of meshComponents) {
            if (meshComponent.material.specularColor != null) {
                meshComponent.material.specularColor = color;
            }
        }
    },
    setObjectFogColor: function (object, color) {
        let meshComponents = object.pp_getComponentsHierarchy("mesh");

        for (let meshComponent of meshComponents) {
            if (meshComponent.material.fogColor != null) {
                meshComponent.material.fogColor = color;
            }
        }
    },
};