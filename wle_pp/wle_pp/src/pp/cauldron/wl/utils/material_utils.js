import { MeshComponent } from "@wonderlandengine/api";
import { vec4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";

export let setAlpha = function () {
    let color = vec4_create();
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
}();

export function setObjectAlpha(object, alpha) {
    let meshComponents = object.pp_getComponents(MeshComponent);

    for (let meshComponent of meshComponents) {
        if (meshComponent.material != null) {
            MaterialUtils.setAlpha(meshComponent.material, alpha);
        }
    }
}

export function setObjectMaterial(object, material, cloneMaterial = false) {
    let meshComponents = object.pp_getComponents(MeshComponent);

    for (let meshComponent of meshComponents) {
        if (cloneMaterial) {
            meshComponent.material = material.clone();
        } else {
            meshComponent.material = material;
        }
    }
}

export function setObjectClonedMaterials(object) {
    let meshComponents = object.pp_getComponents(MeshComponent);

    for (let meshComponent of meshComponents) {
        if (meshComponent.material != null) {
            meshComponent.material = meshComponent.material.clone();
        }
    }
}

export function setObjectSpecularColor(object, color) {
    let meshComponents = object.pp_getComponents(MeshComponent);

    for (let meshComponent of meshComponents) {
        if (meshComponent.material.specularColor != null) {
            meshComponent.material.specularColor = color;
        }
    }
}

export function setObjectFogColor(object, color) {
    let meshComponents = object.pp_getComponents(MeshComponent);

    for (let meshComponent of meshComponents) {
        if (meshComponent.material.fogColor != null) {
            meshComponent.material.fogColor = color;
        }
    }
}

export let MaterialUtils = {
    setAlpha,
    setObjectAlpha,
    setObjectMaterial,
    setObjectClonedMaterials,
    setObjectSpecularColor,
    setObjectFogColor
};