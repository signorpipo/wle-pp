if (WL && WL.Object) {

    WL.MeshComponent.prototype.pp_clone = function (clonedObject, deepCloneParams, extraData) {
        let clonedComponent = clonedObject.pp_addComponent(this.type);
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

    WL.CollisionComponent.prototype.pp_clone = function (clonedObject, deepCloneParams, extraData) {
        let clonedComponent = clonedObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        clonedComponent.collider = this.collider;
        clonedComponent.extents = this.extents.slice(0);
        clonedComponent.group = this.group;

        return clonedComponent;
    };

    WL.TextComponent.prototype.pp_clone = function (clonedObject, deepCloneParams, extraData) {
        let clonedComponent = clonedObject.pp_addComponent(this.type);
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
    WL.PhysXComponent.prototype.pp_clone = function (clonedObject, deepCloneParams, extraData) {
        let clonedComponent = clonedObject.pp_addComponent(this.type, {
            "angularDamping": this.angularDamping,
            "angularVelocity": this.angularVelocity,
            "dynamicFriction": this.dynamicFriction,
            "extents": this.extents,
            "kinematic": this.kinematic,
            "linearDamping": this.linearDamping,
            "linearVelocity": this.linearVelocity,
            "mass": this.mass,
            "restituition": this.restituition,
            "shape": this.shape,
            "shapeData": this.shapeData,
            "static": this.static,
            "staticFriction": this.staticFriction,
        });

        clonedComponent.active = this.active;

        return clonedComponent;
    };



    Object.defineProperty(WL.MeshComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(WL.CollisionComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(WL.TextComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(WL.PhysXComponent.prototype, "pp_clone", { enumerable: false });

}