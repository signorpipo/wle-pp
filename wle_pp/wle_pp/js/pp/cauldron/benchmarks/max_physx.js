// adjust the gravity to a low value like -0.05 to have better results, since the dynamic objects will move slowly instead of quickly falling far away
WL.registerComponent('pp-benchmark-max-physx', {
    _myStaticDomeSize: { type: WL.Type.Float, default: 40 },
    _myStaticPhysXCount: { type: WL.Type.Int, default: 1000 },
    _myDynamicDomeSize: { type: WL.Type.Float, default: 80 },
    _myDynamicPhysXCount: { type: WL.Type.Int, default: 250 },
    _myKinematicDomeSize: { type: WL.Type.Float, default: 120 },
    _myKinematicPhysXCount: { type: WL.Type.Int, default: 250 },
    _myRaycastCount: { type: WL.Type.Int, default: 100 },
    _myVisualizeRaycast: { type: WL.Type.Bool, default: false },
    _myVisualizeRaycastDelay: { type: WL.Type.Float, default: 0.5 },

    // you can use this to test with convex mesh, 
    // but u first need to add a physx with a convex mesh to the scene and read the shapeData index on the component to set it as _myShapeIndex
    _myUseConvexMesh: { type: WL.Type.Bool, default: false },
    _myShapeIndex: { type: WL.Type.Int, default: 0 },
    _myShapeScaleMultiplier: { type: WL.Type.Float, default: 1 }, // used to adjust the scale of the convex mesh if too big or small based on how u imported it

    _myEnableLog: { type: WL.Type.Bool, default: true },
}, {
    start: function () {
        this._myRootObject = WL.scene.addObject(this.object);

        this._myRaycastSetup = new PP.RaycastSetup();
        this._myRaycastResults = new PP.RaycastResults();

        this._myStaticPhysXObjects = [];
        this._myStaticPhysXComponents = [];
        this._myStaticPhysXCollectors = [];
        this._myDynamicPhysXObjects = [];
        this._myDynamicPhysXComponents = [];
        this._myDynamicPhysXCollectors = [];
        this._myKinematicPhysXObjects = [];
        this._myKinematicPhysXComponents = [];
        this._myKinematicPhysXCollectors = [];

        this._spawnDome(true, false);
        this._spawnDome(false, false);
        this._spawnDome(false, true);

        this._myStartTimer = new PP.Timer(1);
        this._myTimer = new PP.Timer(0);
        this._myDebugTimer = new PP.Timer(this._myVisualizeRaycastDelay);
        this._myEnableLogTimer = new PP.Timer(1);
        this._myFPSHistory = [];
        for (let i = 0; i < 7; i++) {
            this._myFPSHistory.push(0);
        }

        this._myAddVelocityDelay = 10;

        this._myTranslateVec3 = PP.vec3_create();
        this._myRotateVec3 = PP.vec3_create();
    },
    update: function (dt) {
        this._myStartTimer.update(dt);
        if (this._myStartTimer.isDone()) {
            this._myTimer.update(dt);
            this._myDebugTimer.update(dt);
            this._myEnableLogTimer.update(dt);
            if (this._myTimer.isDone()) {
                this._myTimer.start();

                let debugActive = false;
                if (this._myDebugTimer.isDone()) {
                    this._myDebugTimer.start();
                    debugActive = true;
                }

                debugActive = debugActive && this._myVisualizeRaycast;
                this._raycastTest(debugActive);
            }

            this._myFPSHistory.pop();
            this._myFPSHistory.unshift(Math.round(1 / dt));

            if (this._myEnableLog) {
                if (this._myEnableLogTimer.isDone()) {
                    this._myEnableLogTimer.start();
                    console.clear();
                    console.log("Static PhysX Dome Size:", this._myStaticPhysXObjects.length);
                    console.log("Dynamic PhysX Dome Size:", this._myDynamicPhysXObjects.length);
                    console.log("Kinematic PhysX Dome Size:", this._myKinematicPhysXObjects.length);

                    let staticCollisions = 0;
                    for (let collector of this._myStaticPhysXCollectors) {
                        staticCollisions += collector.getCollisions().length;
                    }

                    let dynamicCollisions = 0;
                    for (let collector of this._myDynamicPhysXCollectors) {
                        dynamicCollisions += collector.getCollisions().length;
                    }

                    let kinematicCollisions = 0;
                    for (let collector of this._myKinematicPhysXCollectors) {
                        kinematicCollisions += collector.getCollisions().length;
                    }

                    let totalCollisions = (staticCollisions + dynamicCollisions + kinematicCollisions) / 2; //every collision is considered twice since it is caught by 2 physX

                    console.log("Current Collisions Count:", totalCollisions);
                    console.log("Raycast Count:", this._myRaycastCount);
                    console.log("FPS History:");
                    let fpsString = "";
                    for (let fps of this._myFPSHistory) {
                        fpsString = fpsString.concat(fps, "\n");
                    }
                    console.log(fpsString);
                }
            }
        }

        if (this._myAddVelocityDelay > 0) {
            this._myAddVelocityDelay--;
            if (this._myAddVelocityDelay == 0) {
                for (let physX of this._myDynamicPhysXComponents) {
                    physX.kinematic = false;
                    let strength = 50;
                    physX.linearVelocity = [Math.pp_random(-strength, strength), Math.pp_random(-strength, strength), Math.pp_random(-strength, strength)];
                    physX.angularVelocity = [Math.pp_random(-strength, strength), Math.pp_random(-strength, strength), Math.pp_random(-strength, strength)];
                }
            }
        }

        for (let physX of this._myKinematicPhysXObjects) {
            let strength = 5 * dt;
            this._myTranslateVec3.vec3_set(Math.pp_random(-strength, strength), Math.pp_random(-strength, strength), Math.pp_random(-strength, strength));
            physX.pp_translate(this._myTranslateVec3);

            rotateStrength = 50 * dt;
            this._myRotateVec3.vec3_set(Math.pp_random(-rotateStrength, rotateStrength), Math.pp_random(-rotateStrength, rotateStrength), Math.pp_random(-rotateStrength, rotateStrength));
            physX.pp_rotate(this._myRotateVec3);
        }
    },
    _raycastTest(debugActive) {
        let raycastCount = this._myRaycastCount;

        let distance = 10000;

        for (let i = 0; i < raycastCount; i++) {
            let origin = [Math.pp_random(1, 2) * Math.pp_randomSign(), Math.pp_random(1, 2) * Math.pp_randomSign(), Math.pp_random(1, 2) * Math.pp_randomSign()];
            let direction = [Math.pp_random(-1, 1), Math.pp_random(-1, 1), Math.pp_random(-1, 1)];
            direction.vec3_normalize(direction);

            this._myRaycastSetup.myOrigin.vec3_copy(origin);
            this._myRaycastSetup.myDirection.vec3_copy(direction);
            this._myRaycastSetup.myDistance = distance;
            this._myRaycastSetup.myBlockLayerFlags.setMask(255);

            let raycastResults = PP.PhysicsUtils.raycast(this._myRaycastSetup, this._myRaycastResults);

            if (debugActive) {
                PP.myDebugVisualManager.drawRaycast(this._myDebugTimer.getDuration(), raycastResults, true, 5, 0.015);
            }
        }
    },
    _spawnDome(isStatic, isDynamic) {
        let maxCount = this._myStaticPhysXCount;
        let physXList = this._myStaticPhysXObjects;
        let cloves = Math.ceil(Math.sqrt(this._myStaticPhysXCount));
        if (!isStatic) {
            if (isDynamic) {
                cloves = Math.ceil(Math.sqrt(this._myDynamicPhysXCount));
                maxCount = this._myDynamicPhysXCount;
                physXList = this._myDynamicPhysXObjects;
            } else {
                cloves = Math.ceil(Math.sqrt(this._myKinematicPhysXCount));
                maxCount = this._myKinematicPhysXCount;
                physXList = this._myKinematicPhysXObjects;
            }
        }

        let angleForClove = Math.PI * 2 / cloves;

        let minDistance = Math.max(0, this._myStaticDomeSize - 20);
        let maxDistance = this._myStaticDomeSize + 20;

        if (!isStatic) {
            if (isDynamic) {
                minDistance = Math.max(0, this._myDynamicDomeSize - 20);
                maxDistance = this._myDynamicDomeSize + 20;
            } else {
                minDistance = Math.max(0, this._myKinematicDomeSize - 20);
                maxDistance = this._myKinematicDomeSize + 20;
            }
        }

        let minExtraRotation = 0;
        let maxExtraRotation = Math.pp_toRadians(10);

        let upDirection = PP.vec3_create(0, 1, 0);
        let horizontalDirection = PP.vec3_create(0, 0, -1);

        for (let i = 0; i < cloves / 2; i++) {
            let verticalDirection = PP.vec3_create(0, 1, 0);

            let rotationAxis = PP.vec3_create();
            horizontalDirection.vec3_cross(verticalDirection, rotationAxis);
            rotationAxis.vec3_normalize(rotationAxis);

            for (let j = 0; j < cloves; j++) {
                if (physXList.length < maxCount) {
                    let distance = Math.random() * (maxDistance - minDistance) + minDistance;
                    let extraAxisRotation = (Math.random() * 2 - 1) * (maxExtraRotation - minExtraRotation) + minExtraRotation;
                    let extraUpRotation = (Math.random() * 2 - 1) * (maxExtraRotation - minExtraRotation) + minExtraRotation;
                    let physXDirection = verticalDirection.slice(0);

                    physXDirection.vec3_rotateAxisRadians(extraAxisRotation, rotationAxis, physXDirection);
                    physXDirection.vec3_rotateAxisRadians(extraUpRotation, upDirection, physXDirection);

                    physXDirection.vec3_scale(distance, physXDirection);

                    this._addPhysX(physXDirection, isStatic, isDynamic);
                }

                verticalDirection.vec3_rotateAxisRadians(angleForClove / 2, rotationAxis, verticalDirection);

                if (physXList.length < maxCount) {
                    let distance = Math.random() * (maxDistance - minDistance) + minDistance;
                    let extraAxisRotation = (Math.random() * 2 - 1) * (maxExtraRotation - minExtraRotation) + minExtraRotation;
                    let extraUpRotation = (Math.random() * 2 - 1) * (maxExtraRotation - minExtraRotation) + minExtraRotation;
                    let physXDirection = verticalDirection.slice(0);

                    physXDirection.vec3_rotateAxisRadians(extraAxisRotation, rotationAxis, physXDirection);
                    physXDirection.vec3_rotateAxisRadians(extraUpRotation, upDirection, physXDirection);

                    physXDirection.vec3_scale(distance, physXDirection);

                    this._addPhysX(physXDirection, isStatic, isDynamic);
                }

                verticalDirection.vec3_rotateAxisRadians(angleForClove / 2, rotationAxis, verticalDirection);

            }

            horizontalDirection.vec3_rotateAxisRadians(angleForClove, upDirection, horizontalDirection);
        }
    },
    _addPhysX(physXDirection, isStatic, isDynamic) {
        let position = physXDirection;
        let scale = Math.pp_random(1, 10);
        let shape = Math.pp_randomPick(WL.Shape.Sphere, WL.Shape.Box);
        if (this._myUseConvexMesh) {
            shape = WL.Shape.ConvexMesh;
            scale *= this._myShapeScaleMultiplier;
        }

        let physX = WL.scene.addObject(this._myRootObject);
        physX.pp_setPosition(position);

        let physXComponent = physX.pp_addComponent("physx", {
            "shape": shape, "shapeData": { index: this._myShapeIndex },
            "extents": PP.vec3_create(scale, scale, scale),
            "static": isStatic,
            "kinematic": !isDynamic,
            "mass": 1
        });

        if (isStatic) {
            this._myStaticPhysXObjects.push(physX);
            this._myStaticPhysXComponents.push(physXComponent);
            this._myStaticPhysXCollectors.push(new PP.PhysicsCollisionCollector(physXComponent));
        } else if (isDynamic) {
            this._myDynamicPhysXObjects.push(physX);
            this._myDynamicPhysXComponents.push(physXComponent);
            this._myDynamicPhysXCollectors.push(new PP.PhysicsCollisionCollector(physXComponent));
        } else {
            this._myKinematicPhysXObjects.push(physX);
            this._myKinematicPhysXComponents.push(physXComponent);
            this._myKinematicPhysXCollectors.push(new PP.PhysicsCollisionCollector(physXComponent));
        }
    }
});