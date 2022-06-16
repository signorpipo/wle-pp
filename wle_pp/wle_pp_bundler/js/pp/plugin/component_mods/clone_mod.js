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
            let vertexData = new Float32Array(this.mesh.vertexData.length);
            let indexData = new Uint32Array(this.mesh.indexData.length);

            for (let i = 0; i < this.mesh.vertexData.length; i++) {
                vertexData[i] = this.mesh.vertexData[i];
            }

            for (let i = 0; i < this.mesh.indexData.length; i++) {
                indexData[i] = this.mesh.indexData[i];
            }

            clonedComponent.mesh = new WL.Mesh({
                indexData: indexData,
                indexType: WL.MeshIndexType.UnsignedInt,
                vertexData: vertexData
            });
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

    // #TODO not completed
    WL.PhysXComponent.prototype.pp_clone = function (clonedObject, deepCloneParams, extraData) {
        let clonedComponent = clonedObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        clonedComponent.angularDamping = this.angularDamping;
        clonedComponent.angularVelocity = this.angularVelocity.slice(0);

        clonedComponent.dynamicFriction = this.dynamicFriction;

        clonedComponent.extents = this.extents.slice(0);

        clonedComponent.kinematic = this.kinematic;

        clonedComponent.linearDamping = this.linearDamping;
        clonedComponent.linearVelocity = this.linearVelocity.slice(0);

        clonedComponent.mass = this.mass;
        clonedComponent.restitution = this.restitution;
        clonedComponent.static = this.static;
        clonedComponent.staticFriction = this.staticFriction;

        clonedComponent.shape = this.shape;
        clonedComponent.shapeData = this.shapeData;

        return clonedComponent;
    };

    Object.defineProperty(WL.MeshComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(WL.CollisionComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(WL.TextComponent.prototype, "pp_clone", { enumerable: false });
    Object.defineProperty(WL.PhysXComponent.prototype, "pp_clone", { enumerable: false });

}