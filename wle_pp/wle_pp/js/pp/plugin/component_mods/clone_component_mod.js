if (WL && WL.Object) {

    WL.MeshComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new PP.DeepCloneParams(), customParamsMap = null) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        if (deepCloneParams.isDeepCloneComponentVariable("mesh", "material")) {
            clonedComponent.material = this.material.clone();
        } else {
            clonedComponent.material = this.material;
        }

        if (deepCloneParams.isDeepCloneComponentVariable("mesh", "mesh")) {
            clonedComponent.mesh = PP.MeshUtils.cloneMesh(this.mesh);
        } else {
            clonedComponent.mesh = this.mesh;
        }

        clonedComponent.skin = this.skin;

        return clonedComponent;
    };

    WL.CollisionComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new PP.DeepCloneParams(), customParamsMap = null) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        clonedComponent.collider = this.collider;
        clonedComponent.extents = this.extents.slice(0);
        clonedComponent.group = this.group;

        return clonedComponent;
    };

    WL.TextComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new PP.DeepCloneParams(), customParamsMap = null) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        if (deepCloneParams.isDeepCloneComponent("text")) {
            clonedComponent.text = this.text.slice(0);
        } else {
            clonedComponent.text = this.text;
        }

        if (deepCloneParams.isDeepCloneComponentVariable("text", "material")) {
            clonedComponent.material = this.material.clone();
        } else {
            clonedComponent.material = this.material;
        }

        clonedComponent.alignment = this.alignment;
        clonedComponent.justification = this.justification;

        return clonedComponent;
    };

    // #TODO not completed, missing flags like gravity or groups
    WL.PhysXComponent.prototype.pp_clone = function pp_clone(targetObject, deepCloneParams = new PP.DeepCloneParams(), customParamsMap = null) {
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



    Object.defineProperty(WL.MeshComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(WL.CollisionComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(WL.TextComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(WL.PhysXComponent.prototype, "pp_clone", { enumerable: false });

}