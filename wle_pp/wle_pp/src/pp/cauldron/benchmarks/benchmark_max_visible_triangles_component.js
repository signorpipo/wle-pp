import { Alignment, Component, Justification, MeshComponent, Property, TextComponent } from "@wonderlandengine/api";
import { vec2_create, vec3_create, vec4_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { Globals } from "../../pp/globals.js";
import { Timer } from "../cauldron/timer.js";
import { ObjectPool, ObjectPoolParams } from "../object_pool/object_pool.js";
import { XRUtils } from "../utils/xr_utils.js";
import { MeshCreationParams, MeshCreationTriangleParams, MeshCreationVertexParams, MeshUtils } from "../wl/utils/mesh_utils.js";
import { ObjectCloneParams } from "../wl/utils/object_utils.js";

export class BenchmarkMaxVisibleTrianglesComponent extends Component {
    static TypeName = "pp-benchmark-max-visible-triangles";
    static Properties = {
        _myTargetFrameRate: Property.int(-1),                // -1 means it will auto detect it at start
        _myTargetFrameRateThreshold: Property.int(3),
        _myStartPlaneCount: Property.int(1),
        _myPlaneTriangles: Property.int(100),
        _mySecondsBeforeDoubling: Property.float(0.5),       // Higher gives a better frame rate evaluation
        _myDTHistoryToIgnorePercentage: Property.float(0.25),
        _myCloneMaterial: Property.bool(false),
        _myCloneMesh: Property.bool(false),

        _myLogEnabled: Property.bool(true),

        _myStartOnXRStart: Property.bool(false),
        _myDisplayInFrontOfPlayer: Property.bool(true),
        _myDisplayInFrontOfPlayerDistance: Property.float(10),

        _myPlaneMaterial: Property.material(),
        _myBackgroundMaterial: Property.material(),
        _myTextMaterial: Property.material(null)
    };

    _start() {
        this._myBackgroundSize = 4;
        this._myBackgroundObject.pp_setActive(true);
        this._myBackgroundObject.pp_setScale(this._myBackgroundSize + 0.1);
        this._myBackgroundObject.pp_translateLocal(vec3_create(0, 0, -0.001));

        this._myDoubleTimer = new Timer(this._mySecondsBeforeDoubling);
        this._myDone = false;

        this._myCurrentPlanes = this._myStartPlaneCount;

        this._myDTHistory = [];

        this._myUpperLimit = -1;
        this._myLowerLimit = 0;

        this._myPlanes = [];
        this._mySkipNextFrames = 0;
        this._myMaxWaitFrames = 0;

        this._myMaxPlanesReached = false;

        this._myFirstTime = true;
    }

    _update(dt) {
        // Skip lag frames after the new set of plane has been shown, wait for it to be stable
        {
            if (dt < 0.00001) {
                return;
            }

            if (dt > 0.5 && this._myMaxWaitFrames > 0) {
                this._myMaxWaitFrames--;
                return;
            }

            this._myMaxWaitFrames = 10;

            if (this._mySkipNextFrames > 0) {
                this._mySkipNextFrames--;
                return;
            }
        }

        if (!this._myDone) {
            this._myDoubleTimer.update(dt);

            this._myDTHistory.push(dt);

            if (this._myDoubleTimer.isDone()) {
                this._myDoubleTimer.start();

                let frameRate = this._computeAverageFrameRate(false);

                if (this._myFirstTime) {
                    this._myFirstTime = false;
                } else {

                    // If there is not lag, the current plane count is a good lower limit, otherwise the current count is now a upper threshold, we have to search below it
                    let lagging = false;
                    if (frameRate < this._myStableFrameRate - this._myTargetFrameRateThreshold) {
                        this._myUpperLimit = this._myCurrentPlanes;

                        lagging = true;

                        if (this._myUpperLimit == 1) {
                            this._myLowerLimit = 1;
                        }
                    } else {
                        this._myLowerLimit = this._myCurrentPlanes;
                        if (this._myUpperLimit > 0) {
                            this._myUpperLimit = Math.max(this._myUpperLimit, this._myLowerLimit);
                        }
                    }

                    this._myTriangleTextComponent.text = "Triangles: " + this._myCurrentPlanes * this._myRealTrianglesAmount;
                    this._myPlaneTextComponent.text = "Planes: " + this._myCurrentPlanes;
                    this._myFPSTextComponent.text = "FPS: " + frameRate + " / " + this._myStableFrameRate;

                    if (lagging) {
                        this._myTriangleTextComponent.material.color = this._myLagColor;
                        this._myPlaneTextComponent.material.color = this._myLagColor;
                        this._myFPSTextComponent.material.color = this._myLagColor;
                    } else {
                        this._myTriangleTextComponent.material.color = this._myNormalColor;
                        this._myPlaneTextComponent.material.color = this._myNormalColor;
                        this._myFPSTextComponent.material.color = this._myNormalColor;
                    }

                    let reset = false;

                    // Check if the binary search is completed
                    if ((this._myUpperLimit > 0 &&
                        (!lagging && (this._myUpperLimit - this._myLowerLimit) <= Math.max(2, 1000 / this._myRealTrianglesAmount)) ||
                        (lagging && (this._myUpperLimit - this._myLowerLimit) <= 1)) ||
                        (!lagging && this._myMaxPlanesReached)) {
                        if (frameRate < this._myStableFrameRate - this._myTargetFrameRateThreshold) {
                            // Going a bit back with the binary search, maybe the lower limit was not lower after all cause of a bad assumption of average FPS
                            this._myLowerLimit = Math.max(1, Math.floor(this._myUpperLimit / 2.5));
                            this._myUpperLimit = 0;
                            reset = true;

                            if (this._myLogEnabled) {
                                // Reset
                                console.log("Rst - Triangles:", this._myCurrentPlanes * this._myRealTrianglesAmount, "- Planes:", this._myCurrentPlanes, "- Frame Rate:", frameRate);
                            }
                        } else {
                            if (this._myMaxPlanesReached) {
                                if (this._myLogEnabled) {
                                    console.log("Aborted - Max Planes Reached");

                                    this._myDoneTextComponent.text = "Aborted - Max Planes Reached";
                                }
                            } else {
                                this._displayPlanes(this._myLowerLimit);

                                if (this._myLogEnabled) {
                                    console.log("\nEnd - Triangles:", this._myLowerLimit * this._myRealTrianglesAmount, "- Planes:", this._myLowerLimit, "- Frame Rate:", frameRate);
                                    console.log("Plane Triangles (Adjusted):", this._myRealTrianglesAmount);
                                    console.log("Target Frame Rate:", this._myStableFrameRate, "- Threshold: ", (this._myStableFrameRate - this._myTargetFrameRateThreshold));
                                }

                                this._myTriangleTextComponent.text = "Triangles: " + this._myLowerLimit * this._myRealTrianglesAmount;
                                this._myPlaneTextComponent.text = "Planes: " + this._myLowerLimit;
                                this._myFPSTextComponent.text = "FPS: " + frameRate + " / " + this._myStableFrameRate;

                                this._myDoneTextComponent.text = "End";
                            }
                            this._myDone = true;
                        }
                    }

                    if (lagging && !reset) {
                        if (this._myLogEnabled) {
                            console.log("Lag - Triangles:", this._myCurrentPlanes * this._myRealTrianglesAmount, "- Planes:", this._myCurrentPlanes, "- Frame Rate:", frameRate);
                        }
                    }

                    if (!this._myDone) {
                        // Sort of binary search, if there is no upper limit yet, just double
                        if (this._myUpperLimit > 0) {
                            this._myCurrentPlanes = Math.floor((this._myUpperLimit + this._myLowerLimit) / 2);
                            this._myCurrentPlanes = Math.max(this._myCurrentPlanes, 1);
                        } else if (!reset) {
                            this._myCurrentPlanes = this._myLowerLimit * 2;
                        } else {
                            this._myCurrentPlanes = this._myLowerLimit;
                        }

                        if (this._myCurrentPlanes > 50000) {
                            this._myCurrentPlanes = 50000;
                            this._myMaxPlanesReached = true;
                        } else {
                            this._myMaxPlanesReached = false;
                        }
                    }
                }

                if (!this._myDone) {
                    this._displayPlanes(this._myCurrentPlanes);
                    this._myElapsedTime = 0;
                    this._myFrameCount = 0;

                    this._mySkipNextFrames = 30;
                }
            }
        }
    }

    _displayPlanes(count) {
        while (this._myPlanes.length > count) {
            let plane = this._myPlanes.pop();
            Globals.getObjectPoolManager(this.engine).release(this._myPoolID, plane);
        }

        while (this._myPlanes.length < count) {
            let plane = Globals.getObjectPoolManager(this.engine).get(this._myPoolID);
            this._myPlanes.push(plane);
        }

        let gridSize = 1;
        while (gridSize * gridSize < count) {
            gridSize++;
        }

        let spaceBetween = 0.01;
        let totalSpaceBetween = spaceBetween * (gridSize - 1);
        let planeSize = (this._myBackgroundSize * 2 - totalSpaceBetween) / (gridSize * 2);

        let currentCount = count;

        for (let i = 0; i < gridSize && currentCount > 0; i++) {
            for (let j = 0; j < gridSize && currentCount > 0; j++) {
                let plane = this._myPlanes[currentCount - 1];
                plane.pp_setScale(planeSize);

                let position = [-this._myBackgroundSize + planeSize + j * planeSize * 2 + j * spaceBetween, this._myBackgroundSize - planeSize - i * planeSize * 2 - i * spaceBetween, 0];

                plane.pp_setPositionLocal(position);
                plane.pp_setActive(true);

                currentCount--;
            }
        }
    }

    start() {
        this._myValid = false;

        if (!Globals.isDebugEnabled(this.engine)) return;

        this._myValid = true;

        if (this._myPlaneMaterial == null) {
            this._myPlaneMaterial = Globals.getDefaultMaterials(this.engine).myPhongOpaque.clone();
            this._myPlaneMaterial.diffuseColor = vec4_create(0.95, 0.95, 0.95, 1);
            this._myPlaneMaterial.ambientColor = vec4_create(0, 0, 0, 1);
            this._myPlaneMaterial.ambientFactor = 0.5;
        }

        if (this._myBackgroundMaterial == null) {
            this._myBackgroundMaterial = Globals.getDefaultMaterials(this.engine).myPhongOpaque.clone();
            this._myBackgroundMaterial.diffuseColor = vec4_create(0.25, 0.25, 0.25, 1);
            this._myBackgroundMaterial.ambientColor = vec4_create(0, 0, 0, 1);
            this._myBackgroundMaterial.ambientFactor = 0.5;
        }

        if (this._myTextMaterial == null) {
            this._myTextMaterial = Globals.getDefaultMaterials(this.engine).myText.clone();
        }

        this._myLagColor = vec4_create(0.6, 0, 0, 1);
        this._myNormalColor = vec4_create(0.25, 0.25, 0.25, 1);

        this._myRealTrianglesAmount = 0;

        let parent = this.object;
        if (this._myDisplayInFrontOfPlayer) {
            parent = Globals.getPlayerObjects(this.engine).myHead.pp_addObject();
            parent.pp_rotateAxis(180, vec3_create(0, 1, 0));
            parent.pp_translateLocal(vec3_create(0, 0, this._myDisplayInFrontOfPlayerDistance));
        }

        this._myTrianglesObject = parent.pp_addObject();

        this._myBackgroundObject = this._myTrianglesObject.pp_addObject();
        {
            let meshComponent = this._myBackgroundObject.pp_addComponent(MeshComponent);
            meshComponent.mesh = MeshUtils.createPlane(this.engine);
            meshComponent.material = this._myBackgroundMaterial.clone();
        }

        this._myPlaneObject = this._myTrianglesObject.pp_addObject();
        {
            let meshComponent = this._myPlaneObject.pp_addComponent(MeshComponent);
            meshComponent.mesh = this._createPlaneMesh(this._myPlaneTriangles);
            this._myRealTrianglesAmount = meshComponent.mesh.indexData.length / 3;
            meshComponent.material = this._myPlaneMaterial.clone();
        }

        let poolParams = new ObjectPoolParams();
        if (!this._myCloneMesh) {
            poolParams.myInitialPoolSize = 30000;
        } else {
            if (this._myRealTrianglesAmount <= 4) {
                poolParams.myInitialPoolSize = 15000;
            } else if (this._myRealTrianglesAmount <= 8) {
                poolParams.myInitialPoolSize = 10000;
            } else if (this._myRealTrianglesAmount <= 64) {
                poolParams.myInitialPoolSize = 7500;
            } else {
                poolParams.myInitialPoolSize = 5000;
            }
        }
        poolParams.myPercentageToAddWhenEmpty = 0;
        poolParams.myAmountToAddWhenEmpty = 10000;
        poolParams.myCloneParams = new ObjectCloneParams();
        poolParams.myCloneParams.myComponentDeepCloneParams.setDeepCloneComponentVariable(MeshComponent.TypeName, "material", this._myCloneMaterial);
        poolParams.myCloneParams.myComponentDeepCloneParams.setDeepCloneComponentVariable(MeshComponent.TypeName, "mesh", this._myCloneMesh);

        this._myPoolID = this.type + "_" + Math.pp_randomUUID();
        Globals.getObjectPoolManager(this.engine).addPool(this._myPoolID, new ObjectPool(this._myPlaneObject, poolParams));

        this._myBackgroundObject.pp_setActive(false);
        this._myPlaneObject.pp_setActive(false);

        this._myStartTimer = new Timer(2);
        this._mySessionStarted = false;

        this._myTextsObject = this._myTrianglesObject.pp_addObject();
        //this._myTextsObject.pp_addComponent(EasyTransformComponent);

        this._myTriangleTextObject = this._myTextsObject.pp_addObject();
        //this._myTriangleTextObject.pp_addComponent(EasyTransformComponent, { _myLocal: true });

        this._myTriangleTextComponent = this._myTriangleTextObject.pp_addComponent(TextComponent);

        this._myTriangleTextComponent.alignment = Alignment.Left;
        this._myTriangleTextComponent.justification = Justification.Line;
        this._myTriangleTextComponent.material = this._myTextMaterial.clone();
        this._myTriangleTextComponent.material.color = this._myNormalColor;
        this._myTriangleTextComponent.text = " ";
        //this._myTriangleTextComponent.text = "Triangles: 9999999";

        this._myPlaneTextObject = this._myTextsObject.pp_addObject();

        this._myPlaneTextComponent = this._myPlaneTextObject.pp_addComponent(TextComponent);
        //this._myPlaneTextObject.pp_addComponent(EasyTransformComponent, { _myLocal: true });

        this._myPlaneTextComponent.alignment = Alignment.Left;
        this._myPlaneTextComponent.justification = Justification.Line;
        this._myPlaneTextComponent.material = this._myTextMaterial.clone();
        this._myPlaneTextComponent.material.color = this._myNormalColor;
        this._myPlaneTextComponent.text = " ";
        //this._myPlaneTextComponent.text = "Planes: 9999999";

        this._myFPSTextObject = this._myTextsObject.pp_addObject();

        this._myFPSTextComponent = this._myFPSTextObject.pp_addComponent(TextComponent);
        //this._myFPSTextObject.pp_addComponent(EasyTransformComponent, { _myLocal: true });

        this._myFPSTextComponent.alignment = Alignment.Left;
        this._myFPSTextComponent.justification = Justification.Line;
        this._myFPSTextComponent.material = this._myTextMaterial.clone();
        this._myFPSTextComponent.material.color = this._myNormalColor;
        this._myFPSTextComponent.text = " ";
        //this._myFPSTextComponent.text = "FPS: 99.99";

        this._myDoneTextObject = this._myTrianglesObject.pp_addObject();

        this._myDoneTextComponent = this._myDoneTextObject.pp_addComponent(TextComponent);
        //this._myDoneTextObject.pp_addComponent(EasyTransformComponent, { _myLocal: true });

        this._myDoneTextComponent.alignment = Alignment.Center;
        this._myDoneTextComponent.justification = Justification.Line;
        this._myDoneTextComponent.material = this._myTextMaterial.clone();
        this._myDoneTextComponent.material.color = this._myNormalColor;
        this._myDoneTextComponent.text = " ";
        //this._myDoneTextComponent.text = "End";

        this._myTextsObject.pp_setPositionLocal(vec3_create(0, 4.3, 0));
        this._myTextsObject.pp_setScale(2.75);

        this._myTriangleTextObject.pp_setPositionLocal(vec3_create(-1.4, 0, 0));
        this._myPlaneTextObject.pp_setPositionLocal(vec3_create(0.55, 0, 0));
        this._myFPSTextObject.pp_setPositionLocal(vec3_create(-0.315, 0, 0));
        this._myDoneTextObject.pp_setPositionLocal(vec3_create(0, -4.6, 0));
        this._myDoneTextObject.pp_setScale(4);

        this._myDTHistory = [];

        this._myFramesToSkip = 10;
    }

    update(dt) {
        if (!this._myValid) return;

        if (this._myFramesToSkip == 0) {
            if (this._mySessionStarted || !this._myStartOnXRStart) {
                if (this._myStartTimer.isRunning()) {
                    this._myStartTimer.update(dt);

                    this._myDTHistory.push(dt);

                    if (this._myStartTimer.isDone()) {
                        this._myStableFrameRate = this._computeAverageFrameRate(true);
                        if (this._myTargetFrameRate > 0) {
                            this._myStableFrameRate = this._myTargetFrameRate;
                        }

                        if (this._myLogEnabled) {
                            console.log("\nPlane Triangles (Adjusted):", this._myRealTrianglesAmount);
                            console.log("Target Frame Rate:", this._myStableFrameRate, "- Threshold: ", (this._myStableFrameRate - this._myTargetFrameRateThreshold));
                            console.log("");
                        }
                        this._start();
                    }
                } else {
                    this._update(dt);
                }
            } else {
                this._mySessionStarted = XRUtils.getSession(this.engine) != null;
            }
        } else {
            this._myFramesToSkip--;
        }
    }

    _computeAverageFrameRate(firstCompute) {
        let frameRate = 0;

        this._myDTHistory.sort((a, b) => a - b);
        let elementsToRemove = Math.floor(this._myDTHistory.length * Math.min(0.9, this._myDTHistoryToIgnorePercentage * (firstCompute ? 2 : 1)));
        for (let i = 0; i < elementsToRemove && this._myDTHistory.length > 1; i++) {
            this._myDTHistory.pop();
        }

        let averageDT = 0;
        for (let dt of this._myDTHistory) {
            averageDT += dt;
        }
        averageDT /= this._myDTHistory.length;
        frameRate = Math.round(1 / averageDT);

        this._myDTHistory = [];

        return frameRate;
    }

    _createPlaneMesh(trianglesAmount) {
        let squaresAmount = Math.ceil(trianglesAmount / 2);

        let row = 1;
        let column = 1;

        let closestSqrt = 1;
        while (closestSqrt * closestSqrt < squaresAmount) {
            closestSqrt++;
        }

        row = closestSqrt;
        column = closestSqrt;

        while (row > 1 && column > 1 && row * column > squaresAmount && ((row - 1) * column >= squaresAmount)) {
            row--;
        }

        let meshCreationParams = new MeshCreationParams(this.engine);

        for (let i = 0; i < row + 1; i++) {
            for (let j = 0; j < column + 1; j++) {

                let x = (2 / column) * j;
                let y = (2 / row) * i;

                let vertexCreationParams = new MeshCreationVertexParams();

                vertexCreationParams.myPosition = vec3_create();
                vertexCreationParams.myPosition[0] = x - 1;
                vertexCreationParams.myPosition[1] = y - 1;
                vertexCreationParams.myPosition[2] = 0;

                vertexCreationParams.myTextureCoordinates = vec2_create();
                vertexCreationParams.myTextureCoordinates[0] = x / 2;
                vertexCreationParams.myTextureCoordinates[1] = y / 2;

                vertexCreationParams.myNormal = vec3_create();
                vertexCreationParams.myNormal[0] = 0;
                vertexCreationParams.myNormal[1] = 0;
                vertexCreationParams.myNormal[2] = 1;

                meshCreationParams.myVertexes.push(vertexCreationParams);
            }
        }

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                let firstTriangle = new MeshCreationTriangleParams();
                firstTriangle.myIndexes[0] = (i * (column + 1)) + j;
                firstTriangle.myIndexes[1] = (i * (column + 1)) + j + 1;
                firstTriangle.myIndexes[2] = ((i + 1) * (column + 1)) + j;

                let secondTriangle = new MeshCreationTriangleParams();
                secondTriangle.myIndexes[0] = ((i + 1) * (column + 1)) + j;
                secondTriangle.myIndexes[1] = (i * (column + 1)) + j + 1;
                secondTriangle.myIndexes[2] = ((i + 1) * (column + 1)) + j + 1;

                meshCreationParams.myTriangles.push(firstTriangle);
                meshCreationParams.myTriangles.push(secondTriangle);
            }
        }

        let mesh = MeshUtils.create(meshCreationParams);

        return mesh;
    }

    onDestroy() {
        Globals.getObjectPoolManager(this.engine)?.destroyPool(this._myPoolID);
    }
}