import { MeshComponent, TextComponent } from "@wonderlandengine/api";
import { ComponentDeepCloneParams, ComponentUtils } from "./component_utils.js";
import { MeshUtils } from "./mesh_utils.js";

export function cloneMesh(componentToClone, targetObject, deepCloneParams = new ComponentDeepCloneParams(), customCloneParams = null) {
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

export function cloneCollision(componentToClone, targetObject, deepCloneParams = new ComponentDeepCloneParams(), customCloneParams = null) {
    let clonedComponent = ComponentUtils.cloneDefault(componentToClone, targetObject);

    return clonedComponent;
}

export function cloneText(componentToClone, targetObject, deepCloneParams = new ComponentDeepCloneParams(), customCloneParams = null) {
    let clonedComponent = ComponentUtils.cloneDefault(componentToClone, targetObject);

    if (deepCloneParams.isDeepCloneComponentVariable(TextComponent.TypeName, "material")) {
        if (componentToClone.material != null) {
            clonedComponent.material = componentToClone.material.clone();
        }
    }

    return clonedComponent;
}

export function clonePhysX(componentToClone, targetObject, deepCloneParams = new ComponentDeepCloneParams(), customCloneParams = null) {
    let clonedComponent = ComponentUtils.cloneDefault(componentToClone, targetObject);

    return clonedComponent;
}

export let WLComponentDefaultCloneCallbacks = {
    cloneMesh,
    cloneCollision,
    cloneText,
    clonePhysX
};