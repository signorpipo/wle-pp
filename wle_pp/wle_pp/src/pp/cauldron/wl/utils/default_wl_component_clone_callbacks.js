import { MeshComponent, TextComponent } from "@wonderlandengine/api";
import { MeshUtils } from "../../utils/mesh_utils.js";
import { ComponentUtils, DeepCloneParams } from "./component_utils.js";

export function cloneMesh(componentToClone, targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
    let clonedComponent = ComponentUtils.cloneDefault(componentToClone, targetObject, true);

    if (deepCloneParams.isDeepCloneComponentVariable(MeshComponent.TypeName, "material")) {
        if (componentToClone.material != null) {
            clonedComponent.material = componentToClone.material.clone();
        }
    }

    if (deepCloneParams.isDeepCloneComponentVariable(MeshComponent.TypeName, "mesh")) {
        clonedComponent.mesh = MeshUtils.clone(componentToClone.mesh);
    }

    return clonedComponent;
}

export function cloneCollision(componentToClone, targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
    let clonedComponent = ComponentUtils.cloneDefault(componentToClone, targetObject);

    return clonedComponent;
}

export function cloneText(componentToClone, targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
    let clonedComponent = ComponentUtils.cloneDefault(componentToClone, targetObject);

    if (deepCloneParams.isDeepCloneComponentVariable(TextComponent.TypeName, "material")) {
        if (componentToClone.material != null) {
            clonedComponent.material = componentToClone.material.clone();
        }
    }

    return clonedComponent;
}

export function clonePhysX(componentToClone, targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
    let clonedComponent = ComponentUtils.cloneDefault(componentToClone, targetObject);

    return clonedComponent;
}

export let DefaultWLComponentCloneCallbacks = {
    cloneMesh,
    cloneCollision,
    cloneText,
    clonePhysX
};