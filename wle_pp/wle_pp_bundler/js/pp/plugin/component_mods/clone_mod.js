//Overall Deep Clone not implemented
WL.MeshComponent.prototype.pp_clone = function (clone, deepCloneParams, extraData) {
    if (deepCloneParams.shouldDeepCloneComponentVariable("mesh", "material")) {
        clone.material = this.material.clone();
    } else {
        clone.material = this.material;
    }

    clone.mesh = this.mesh;
    clone.skin = this.skin;
};

WL.CollisionComponent.prototype.pp_clone = function (clone, deepCloneParams, extraData) {
    clone.collider = this.collider;
    clone.extents = this.extents.slice(0);
    clone.group = this.group;
};

WL.TextComponent.prototype.pp_clone = function (clone, deepCloneParams, extraData) {
    if (deepCloneParams.shouldDeepCloneComponent("text")) {
        clone.text = this.text.slice(0);
    } else {
        clone.text = this.text;
    }

    if (deepCloneParams.shouldDeepCloneComponentVariable("text", "material")) {
        clone.material = this.material.clone();
    } else {
        clone.material = this.material;
    }

    clone.alignment = this.alignment;
    clone.justification = this.justification;
};

//TEMP not complete
WL.PhysXComponent.prototype.pp_clone = function (clone, deepCloneParams, extraData) {
    clone.angularDamping = this.angularDamping;
    clone.angularVelocity = this.angularVelocity.slice(0);

    clone.dynamicFriction = this.dynamicFriction;

    clone.extents = this.extents.slice(0);

    clone.kinematic = this.kinematic;

    clone.linearDamping = this.linearDamping;
    clone.linearVelocity = this.linearVelocity.slice(0);

    clone.mass = this.mass;
    clone.restitution = this.restitution;
    clone.shape = this.shape;
    clone.static = this.static;
    clone.staticFriction = this.staticFriction;
};

Object.defineProperty(WL.MeshComponent.prototype, "pp_clone", { enumerable: false });
Object.defineProperty(WL.CollisionComponent.prototype, "pp_clone", { enumerable: false });
Object.defineProperty(WL.TextComponent.prototype, "pp_clone", { enumerable: false });
Object.defineProperty(WL.PhysXComponent.prototype, "pp_clone", { enumerable: false });