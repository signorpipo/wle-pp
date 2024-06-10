import { Material, MeshComponent, Object3D, TextComponent } from "@wonderlandengine/api";
import { vec4_create } from "../../../plugin/js/extensions/array/vec_create_extension.js";
import { Vector4 } from "../../type_definitions/array_type_definitions.js";
import { FlatMaterial, PhongMaterial } from "../type_definitions/material_type_definitions.js";

export const setAlpha = function () {
    const color = vec4_create();
    return function setAlpha(material: Material, alpha: number): void {
        const flatMaterial = material as FlatMaterial;
        if (flatMaterial.color != null) {
            color.vec4_copy(flatMaterial.color);
            color[3] = alpha;
            flatMaterial.color = color;
        }

        const phongMaterial = material as PhongMaterial;
        if (phongMaterial.diffuseColor != null) {
            color.vec4_copy(phongMaterial.diffuseColor);
            color[3] = alpha;
            phongMaterial.diffuseColor = color;
        }

        if (phongMaterial.ambientColor != null) {
            color.vec4_copy(phongMaterial.ambientColor);
            color[3] = alpha;
            phongMaterial.ambientColor = color;
        }
    };
}();

export function setObjectAlpha(object: Readonly<Object3D>, alpha: number): void {
    const meshComponents = object.pp_getComponents(MeshComponent);
    for (const meshComponent of meshComponents) {
        if (meshComponent.material != null) {
            MaterialUtils.setAlpha(meshComponent.material, alpha);
        }
    }

    const textComponents = object.pp_getComponents(TextComponent);
    for (const textComponent of textComponents) {
        if (textComponent.material != null) {
            MaterialUtils.setAlpha(textComponent.material, alpha);
        }
    }
}

export function setObjectMaterial(object: Readonly<Object3D>, material: Material, cloneMaterial: boolean = false): void {
    const meshComponents = object.pp_getComponents(MeshComponent);
    for (const meshComponent of meshComponents) {
        if (cloneMaterial) {
            meshComponent.material = material.clone();
        } else {
            meshComponent.material = material;
        }
    }

    const textComponents = object.pp_getComponents(TextComponent);
    for (const textComponent of textComponents) {
        if (cloneMaterial) {
            textComponent.material = material.clone();
        } else {
            textComponent.material = material;
        }
    }
}

export function setObjectClonedMaterials(object: Readonly<Object3D>): void {
    const meshComponents = object.pp_getComponents(MeshComponent);
    for (const meshComponent of meshComponents) {
        if (meshComponent.material != null) {
            meshComponent.material = meshComponent.material.clone();
        }
    }

    const textComponents = object.pp_getComponents(TextComponent);
    for (const textComponent of textComponents) {
        if (textComponent.material != null) {
            textComponent.material = textComponent.material.clone();
        }
    }
}

export function setObjectSpecularColor(object: Readonly<Object3D>, color: Readonly<Vector4>): void {
    const meshComponents = object.pp_getComponents(MeshComponent);
    for (const meshComponent of meshComponents) {
        if (meshComponent.material != null) {
            const phongMaterial = meshComponent.material as PhongMaterial;
            if (phongMaterial.specularColor != null) {
                phongMaterial.specularColor = color;
            }
        }
    }

    const textComponents = object.pp_getComponents(TextComponent);
    for (const textComponent of textComponents) {
        if (textComponent.material != null) {
            const phongMaterial = textComponent.material as PhongMaterial;
            if (phongMaterial.specularColor != null) {
                phongMaterial.specularColor = color;
            }
        }
    }
}

export function setObjectFogColor(object: Readonly<Object3D>, color: Readonly<Vector4>): void {
    const meshComponents = object.pp_getComponents(MeshComponent);
    for (const meshComponent of meshComponents) {
        if (meshComponent.material != null) {
            const phongMaterial = meshComponent.material as PhongMaterial;
            if (phongMaterial.fogColor != null) {
                phongMaterial.fogColor = color;
            }
        }
    }

    const textComponents = object.pp_getComponents(TextComponent);
    for (const textComponent of textComponents) {
        if (textComponent.material != null) {
            const phongMaterial = textComponent.material as PhongMaterial;
            if (phongMaterial.fogColor != null) {
                phongMaterial.fogColor = color;
            }
        }
    }
}

export const MaterialUtils = {
    setAlpha,
    setObjectAlpha,
    setObjectMaterial,
    setObjectClonedMaterials,
    setObjectSpecularColor,
    setObjectFogColor
} as const;