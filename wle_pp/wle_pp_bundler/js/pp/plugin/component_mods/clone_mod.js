if (WL && WL.Object) {

    WL.MeshComponent.prototype.pp_clone = function (clone, deepCloneParams, extraData) {
        if (deepCloneParams.isDeepCloneComponentVariable("mesh", "material")) {
            clone.material = this.material.clone();
        } else {
            clone.material = this.material;
        }

        if (deepCloneParams.isDeepCloneComponentVariable("mesh", "mesh")) {
            let vertexData = new Float32Array(this.mesh.vertexData.length);
            let indexData = new Uint32Array(this.mesh.indexData.length);

            for (let i = 0; i < this.mesh.vertexData.length; i++) {
                vertexData[i] = this.mesh.vertexData[i];
            }

            for (let i = 0; i < this.mesh.indexData.length; i++) {
                indexData[i] = this.mesh.indexData[i];
            }

            clone.mesh = new WL.Mesh({
                indexData: indexData,
                indexType: WL.MeshIndexType.UnsignedInt,
                vertexData: vertexData
            });
        } else {
            clone.mesh = this.mesh;
        }

        clone.skin = this.skin;
    };

    WL.CollisionComponent.prototype.pp_clone = function (clone, deepCloneParams, extraData) {
        clone.collider = this.collider;
        clone.extents = this.extents.slice(0);
        clone.group = this.group;
    };

    WL.TextComponent.prototype.pp_clone = function (clone, deepCloneParams, extraData) {
        if (deepCloneParams.isDeepCloneComponent("text")) {
            clone.text = this.text.slice(0);
        } else {
            clone.text = this.text;
        }

        if (deepCloneParams.isDeepCloneComponentVariable("text", "material")) {
            clone.material = this.material.clone();
        } else {
            clone.material = this.material;
        }

        clone.alignment = this.alignment;
        clone.justification = this.justification;
    };

    // #TODO not completed
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

}