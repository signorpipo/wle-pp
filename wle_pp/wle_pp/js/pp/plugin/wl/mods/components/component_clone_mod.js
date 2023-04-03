import { MeshComponent, CollisionComponent, TextComponent, PhysXComponent } from "@wonderlandengine/api";
import { MeshUtils } from "../../../../cauldron/utils/mesh_utils";
import { DeepCloneParams } from "../../extensions/object_extension";

export function initComponentCloneMod() {

    MeshComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        if (deepCloneParams.isDeepCloneComponentVariable(MeshComponent.TypeName, "material")) {
            clonedComponent.material = this.material.clone();
        } else {
            clonedComponent.material = this.material;
        }

        if (deepCloneParams.isDeepCloneComponentVariable(MeshComponent.TypeName, "mesh")) {
            clonedComponent.mesh = MeshUtils.cloneMesh(this.mesh);
        } else {
            clonedComponent.mesh = this.mesh;
        }

        clonedComponent.skin = this.skin;

        return clonedComponent;
    };

    CollisionComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        clonedComponent.collider = this.collider;
        clonedComponent.extents = this.extents.pp_clone();
        clonedComponent.group = this.group;

        return clonedComponent;
    };

    TextComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        if (deepCloneParams.isDeepCloneComponent(TextComponent.TypeName)) {
            clonedComponent.text = this.text.slice(0);
        } else {
            clonedComponent.text = this.text;
        }

        if (deepCloneParams.isDeepCloneComponentVariable(TextComponent.TypeName, "material")) {
            clonedComponent.material = this.material.clone();
        } else {
            clonedComponent.material = this.material;
        }

        clonedComponent.alignment = this.alignment;
        clonedComponent.justification = this.justification;

        return clonedComponent;
    };

    // #TODO Not completed, missing flags like gravity or groups
    PhysXComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new DeepCloneParams(), customCloneParams = null) {
        let componentParams = {
            "static": this.static,
            "simulate": this.simulate,
            "angularDamping": this.angularDamping,
            "dynamicFriction": this.dynamicFriction,
            "extents": this.extents,
            "kinematic": this.kinematic,
            "linearDamping": this.linearDamping,
            "mass": this.mass,
            "restituition": this.restituition,
            "shape": this.shape,
            "shapeData": this.shapeData,
            "staticFriction": this.staticFriction,
            "bounciness": this.bounciness,
            "allowQuery": this.allowQuery,
            "allowSimulation": this.allowSimulation,
            "gravity": this.gravity,
            "trigger": this.trigger
        };

        if (!this.static) {
            componentParams["angularVelocity"] = this.angularVelocity;
            componentParams["linearVelocity"] = this.linearVelocity;
        }

        let clonedComponent = targetObject.pp_addComponent(this.type, componentParams);
        clonedComponent.active = this.active;

        return clonedComponent;
    };



    Object.defineProperty(MeshComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(CollisionComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(TextComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(PhysXComponent.prototype, "pp_clone", { enumerable: false });

}