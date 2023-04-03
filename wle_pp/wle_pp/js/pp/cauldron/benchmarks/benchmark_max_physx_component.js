import { Component, PhysXComponent, Property } from "@wonderlandengine/api";
import { getDebugVisualManager } from "../../debug/debug_globals";
import { vec3_create } from "../../plugin/js/extensions/array_extension";
import { Timer } from "../cauldron/timer";
import { PhysicsCollisionCollector } from "../physics/physics_collision_collector";
import { RaycastResults, RaycastSetup } from "../physics/physics_raycast_data";
import { PhysicsUtils } from "../physics/physics_utils";

// Adjust the gravity to a low value like -0.05 to have better results, since the dynamic objects will move slowly instead of quickly falling far away
export class BenchmarkMaxPhysXComponent extends Component {
    static TypeName = "pp-benchmark-max-physx";
    static Properties = {
        _myStaticDomeSize: Property.float(40),
        _myStaticPhysXCount: Property.int(1000),
        _myDynamicDomeSize: Property.float(80),
        _myDynamicPhysXCount: Property.int(250),
        _myKinematicDomeSize: Property.float(120),
        _myKinematicPhysXCount: Property.int(250),
        _myRaycastCount: Property.int(100),
        _myVisualizeRaycast: Property.bool(false),
        _myVisualizeRaycastDelay: Property.float(0.5),

        // You can use this to test with convex mesh, 
        // but u first need to add a physx with a convex mesh to the scene and read the shapeData index on the component to set it as _myShapeIndex
        _myUseConvexMesh: Property.bool(false),
        _myShapeIndex: Property.int(0),
        _myShapeScaleMultiplier: Property.float(1), // Used to adjust the scale of the convex mesh if too big or small based on how u imported it

        _myLogActive: Property.bool(true),
        _myClearConsoleBeforeLog: Property.bool(true)
    };

    start() {
        this._myStarted = false;
        this._myPreStartTimer = new Timer(1);
    }

    _start() {
        this._myRootObject = this.object.pp_addObject();

        this._myRaycastSetup = new RaycastSetup(this.engine.physics);
        this._myRaycastResults = new RaycastResults();

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

        this._myStartTimer = new Timer(1);
        this._myTimer = new Timer(0);
        this._myDebugTimer = new Timer(this._myVisualizeRaycastDelay);
        this._myLogActiveTimer = new Timer(1);
        this._myFPSHistory = [];
        for (let i = 0; i < 7; i++) {
            this._myFPSHistory.push(0);
        }

        this._myAddVelocityDelay = 10;

        this._myTranslateVec3 = vec3_create();
        this._myRotateVec3 = vec3_create();

        this._myStarted = true;
    }

    update(dt) {
        if (!this._myStarted) {
            this._myPreStartTimer.update(dt);
            if (this._myPreStartTimer.isDone()) {
                this._start();
            }
        } else {
            this._myStartTimer.update(dt);
            if (this._myStartTimer.isDone()) {
                this._myTimer.update(dt);
                this._myDebugTimer.update(dt);
                this._myLogActiveTimer.update(dt);
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

                if (this._myLogActive) {
                    if (this._myLogActiveTimer.isDone()) {
                        this._myLogActiveTimer.start();
                        if (this._myClearConsoleBeforeLog) {
                            console.clear();
                        }
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

                        // Every collision is considered twice since it is caught by 2 physX
                        let totalCollisions = (staticCollisions + dynamicCollisions + kinematicCollisions) / 2;

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

                let rotateStrength = 50 * dt;
                this._myRotateVec3.vec3_set(Math.pp_random(-rotateStrength, rotateStrength), Math.pp_random(-rotateStrength, rotateStrength), Math.pp_random(-rotateStrength, rotateStrength));
                physX.pp_rotate(this._myRotateVec3);
            }
        }
    }

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
            this._myRaycastSetup.myBlockLayerFlags.setAllFlagsActive();

            let raycastResults = PhysicsUtils.raycast(this._myRaycastSetup, this._myRaycastResults);

            if (debugActive) {
                getDebugVisualManager(this.engine).drawRaycast(this._myDebugTimer.getDuration(), raycastResults, true, 5, 0.015);
            }
        }
    }

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

        let upDirection = vec3_create(0, 1, 0);
        let horizontalDirection = vec3_create(0, 0, -1);

        for (let i = 0; i < cloves / 2; i++) {
            let verticalDirection = vec3_create(0, 1, 0);

            let rotationAxis = vec3_create();
            horizontalDirection.vec3_cross(verticalDirection, rotationAxis);
            rotationAxis.vec3_normalize(rotationAxis);

            for (let j = 0; j < cloves; j++) {
                if (physXList.length < maxCount) {
                    let distance = Math.random() * (maxDistance - minDistance) + minDistance;
                    let extraAxisRotation = (Math.random() * 2 - 1) * (maxExtraRotation - minExtraRotation) + minExtraRotation;
                    let extraUpRotation = (Math.random() * 2 - 1) * (maxExtraRotation - minExtraRotation) + minExtraRotation;
                    let physXDirection = verticalDirection.pp_clone();

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
                    let physXDirection = verticalDirection.pp_clone();

                    physXDirection.vec3_rotateAxisRadians(extraAxisRotation, rotationAxis, physXDirection);
                    physXDirection.vec3_rotateAxisRadians(extraUpRotation, upDirection, physXDirection);

                    physXDirection.vec3_scale(distance, physXDirection);

                    this._addPhysX(physXDirection, isStatic, isDynamic);
                }

                verticalDirection.vec3_rotateAxisRadians(angleForClove / 2, rotationAxis, verticalDirection);

            }

            horizontalDirection.vec3_rotateAxisRadians(angleForClove, upDirection, horizontalDirection);
        }
    }

    _addPhysX(physXDirection, isStatic, isDynamic) {
        let position = physXDirection;
        let scale = Math.pp_random(1, 10);
        let shape = Math.pp_randomPick(this.engine.Shape.Sphere, this.engine.Shape.Box);
        if (this._myUseConvexMesh) {
            shape = this.engine.Shape.ConvexMesh;
            scale *= this._myShapeScaleMultiplier;
        }

        let physX = this._myRootObject.pp_addObject();
        physX.pp_setPosition(position);

        let physXComponent = physX.pp_addComponent(PhysXComponent, {
            "shape": shape,
            "shapeData": { index: this._myShapeIndex },
            "extents": vec3_create(scale, scale, scale),
            "static": isStatic,
            "kinematic": !isDynamic,
            "mass": 1
        });

        if (isStatic) {
            this._myStaticPhysXObjects.push(physX);
            this._myStaticPhysXComponents.push(physXComponent);
            this._myStaticPhysXCollectors.push(new PhysicsCollisionCollector(physXComponent));
        } else if (isDynamic) {
            this._myDynamicPhysXObjects.push(physX);
            this._myDynamicPhysXComponents.push(physXComponent);
            this._myDynamicPhysXCollectors.push(new PhysicsCollisionCollector(physXComponent));
        } else {
            this._myKinematicPhysXObjects.push(physX);
            this._myKinematicPhysXComponents.push(physXComponent);
            this._myKinematicPhysXCollectors.push(new PhysicsCollisionCollector(physXComponent));
        }
    }
}