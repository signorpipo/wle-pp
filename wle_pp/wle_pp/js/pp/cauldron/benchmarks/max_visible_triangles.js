WL.registerComponent("pp-benchmark-max-visible-triangles", {
    _myTargetFrameRate: { type: WL.Type.Int, default: -1 },     // -1 means it will auto detect it at start
    _myTargetFrameRateThreshold: { type: WL.Type.Int, default: 3 },
    _myStartPlaneCount: { type: WL.Type.Int, default: 1 },
    _myPlaneTriangles: { type: WL.Type.Int, default: 100 },
    _mySecondsBeforeDoubling: { type: WL.Type.Float, default: 0.5 },    // higher gives a better frame rate evaluation
    _myDTHistoryToIgnorePercentage: { type: WL.Type.Float, default: 0.25 },
    _myCloneMaterial: { type: WL.Type.Bool, default: false },
    _myCloneMesh: { type: WL.Type.Bool, default: false },

    _myEnableLog: { type: WL.Type.Bool, default: true },

    _myPlaneMaterial: { type: WL.Type.Material },
    _myBackgroundMaterial: { type: WL.Type.Material },
    _myTextMaterial: { type: WL.Type.Material, default: null },
}, {
    _start() {
        this._myBackgroundSize = 4;
        this._myBackgroundObject.pp_setActive(true);
        this._myBackgroundObject.pp_setScale(this._myBackgroundSize + 0.1);
        this._myBackgroundObject.pp_translate(PP.vec3_create(0, 0, -0.001));

        this._myDoubleTimer = new PP.Timer(this._mySecondsBeforeDoubling);
        this._myIsDone = false;

        this._myCurrentPlanes = this._myStartPlaneCount;

        this._myDTHistory = [];

        this._myUpperLimit = -1;
        this._myLowerLimit = 0;

        this._myPlanes = [];
        this._mySkipNextFrames = 0;
        this._myMaxWaitFrames = 0;

        this._myMaxPlanesReached = false;

        this._myFirstTime = true;
    },
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

        if (!this._myIsDone) {
            this._myDoubleTimer.update(dt);

            this._myDTHistory.push(dt);

            if (this._myDoubleTimer.isDone()) {
                this._myDoubleTimer.start();

                let frameRate = this._computeAverageFrameRate(false);

                if (this._myFirstTime) {
                    this._myFirstTime = false;
                } else {

                    // if there is not lag, the current plane count is a good lower limit, otherwise the current count is now a upper threshold, we have to search below it
                    let isLagging = false;
                    if (frameRate < this._myStableFrameRate - this._myTargetFrameRateThreshold) {
                        this._myUpperLimit = this._myCurrentPlanes;

                        isLagging = true;

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

                    if (isLagging) {
                        this._myTriangleTextComponent.material.color = this._myLagColor;
                        this._myPlaneTextComponent.material.color = this._myLagColor;
                        this._myFPSTextComponent.material.color = this._myLagColor;
                    } else {
                        this._myTriangleTextComponent.material.color = this._myNormalColor;
                        this._myPlaneTextComponent.material.color = this._myNormalColor;
                        this._myFPSTextComponent.material.color = this._myNormalColor;
                    }

                    let reset = false;

                    // check if the binary search is completed
                    if ((this._myUpperLimit > 0 &&
                        (!isLagging && (this._myUpperLimit - this._myLowerLimit) <= Math.max(2, 1000 / this._myRealTrianglesAmount)) ||
                        (isLagging && (this._myUpperLimit - this._myLowerLimit) <= 1)) ||
                        (!isLagging && this._myMaxPlanesReached)) {
                        if (frameRate < this._myStableFrameRate - this._myTargetFrameRateThreshold) {
                            // going a bit back with the binary search, maybe the lower limit was not lower after all cause of a bad assumption of average FPS
                            this._myLowerLimit = Math.max(1, Math.floor(this._myUpperLimit / 2.5));
                            this._myUpperLimit = 0;
                            reset = true;

                            if (this._myEnableLog) {
                                console.log("Rst - Triangles:", this._myCurrentPlanes * this._myRealTrianglesAmount, "- Planes:", this._myCurrentPlanes, "- Frame Rate:", frameRate);
                            }
                        } else {
                            if (this._myMaxPlanesReached) {
                                if (this._myEnableLog) {
                                    console.log("Aborted - Max Planes Reached");

                                    this._myDoneTextComponent.text = "Aborted - Max Planes Reached";
                                }
                            } else {
                                this._displayPlanes(this._myLowerLimit);

                                if (this._myEnableLog) {
                                    console.log("\nEnd - Triangles:", this._myLowerLimit * this._myRealTrianglesAmount, "- Planes:", this._myLowerLimit, "- Frame Rate:", frameRate);
                                    console.log("Plane Triangles (Adjusted):", this._myRealTrianglesAmount);
                                    console.log("Target Frame Rate:", this._myStableFrameRate, "- Threshold: ", (this._myStableFrameRate - this._myTargetFrameRateThreshold));
                                }

                                this._myTriangleTextComponent.text = "Triangles: " + this._myLowerLimit * this._myRealTrianglesAmount;
                                this._myPlaneTextComponent.text = "Planes: " + this._myLowerLimit;
                                this._myFPSTextComponent.text = "FPS: " + frameRate + " / " + this._myStableFrameRate;

                                this._myDoneTextComponent.text = "End";
                            }
                            this._myIsDone = true;
                        }
                    }

                    if (isLagging && !reset) {
                        if (this._myEnableLog) {
                            console.log("Lag - Triangles:", this._myCurrentPlanes * this._myRealTrianglesAmount, "- Planes:", this._myCurrentPlanes, "- Frame Rate:", frameRate);
                        }
                    }

                    if (!this._myIsDone) {
                        // sort of binary search, if there is no upper limit yet, just double
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

                if (!this._myIsDone) {
                    this._displayPlanes(this._myCurrentPlanes);
                    this._myElapsedTime = 0;
                    this._myFrameCount = 0;

                    this._mySkipNextFrames = 30;
                }
            }
        }
    },
    _displayPlanes(count) {
        while (this._myPlanes.length > count) {
            let plane = this._myPlanes.pop();
            this._myPlanePool.release(plane);
        }

        while (this._myPlanes.length < count) {
            let plane = this._myPlanePool.get();
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
    },
    start() {
        this._myLagColor = PP.vec4_create(0.5, 0, 0, 1);
        this._myNormalColor = PP.vec4_create(0, 0, 0, 1);

        this._myRealTrianglesAmount = 0;

        this._myTrianglesObject = WL.scene.addObject(this.object);

        this._myBackgroundObject = WL.scene.addObject(this._myTrianglesObject);
        {
            let meshComponent = this._myBackgroundObject.addComponent('mesh');
            meshComponent.mesh = PP.MeshUtils.createPlaneMesh();
            meshComponent.material = this._myBackgroundMaterial.clone();
        }

        this._myPlaneObject = WL.scene.addObject(this._myTrianglesObject);
        {
            let meshComponent = this._myPlaneObject.addComponent('mesh');
            meshComponent.mesh = this._createPlaneMesh(this._myPlaneTriangles);
            this._myRealTrianglesAmount = meshComponent.mesh.indexData.length / 3;
            meshComponent.material = this._myPlaneMaterial.clone();
        }

        let poolParams = new PP.ObjectPoolParams();
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
        poolParams.myCloneParams = new PP.CloneParams();
        poolParams.myCloneParams.myDeepCloneParams.setDeepCloneComponentVariable("mesh", "material", this._myCloneMaterial);
        poolParams.myCloneParams.myDeepCloneParams.setDeepCloneComponentVariable("mesh", "mesh", this._myCloneMesh);
        this._myPlanePool = new PP.ObjectPool(this._myPlaneObject, poolParams);

        this._myBackgroundObject.pp_setActive(false);
        this._myPlaneObject.pp_setActive(false);

        this._myStartTimer = new PP.Timer(this._mySecondsBeforeDoubling * 2);
        this._mySessionStarted = false;

        this._myTextsObject = WL.scene.addObject(this._myTrianglesObject);
        //this._myTextsObject.pp_addComponent("pp-easy-transform");

        this._myTriangleTextObject = WL.scene.addObject(this._myTextsObject);
        //this._myTriangleTextObject.pp_addComponent("pp-easy-transform", { _myIsLocal: true });

        this._myTriangleTextComponent = this._myTriangleTextObject.addComponent('text');

        this._myTriangleTextComponent.alignment = WL.Alignment.Left;
        this._myTriangleTextComponent.justification = WL.Justification.Line;
        this._myTriangleTextComponent.material = this._myTextMaterial.clone();
        this._myTriangleTextComponent.material.color = this._myNormalColor;
        this._myTriangleTextComponent.text = " ";
        //this._myTriangleTextComponent.text = "Triangles: 9999999";

        this._myPlaneTextObject = WL.scene.addObject(this._myTextsObject);

        this._myPlaneTextComponent = this._myPlaneTextObject.addComponent('text');
        //this._myPlaneTextObject.pp_addComponent("pp-easy-transform", { _myIsLocal: true });

        this._myPlaneTextComponent.alignment = WL.Alignment.Left;
        this._myPlaneTextComponent.justification = WL.Justification.Line;
        this._myPlaneTextComponent.material = this._myTextMaterial.clone();
        this._myPlaneTextComponent.material.color = this._myNormalColor;
        this._myPlaneTextComponent.text = " ";
        //this._myPlaneTextComponent.text = "Planes: 9999999";

        this._myFPSTextObject = WL.scene.addObject(this._myTextsObject);

        this._myFPSTextComponent = this._myFPSTextObject.addComponent('text');
        //this._myFPSTextObject.pp_addComponent("pp-easy-transform", { _myIsLocal: true });

        this._myFPSTextComponent.alignment = WL.Alignment.Left;
        this._myFPSTextComponent.justification = WL.Justification.Line;
        this._myFPSTextComponent.material = this._myTextMaterial.clone();
        this._myFPSTextComponent.material.color = this._myNormalColor;
        this._myFPSTextComponent.text = " ";
        //this._myFPSTextComponent.text = "FPS: 99.99";

        this._myDoneTextObject = WL.scene.addObject(this._myTrianglesObject);

        this._myDoneTextComponent = this._myDoneTextObject.addComponent('text');
        //this._myDoneTextObject.pp_addComponent("pp-easy-transform", { _myIsLocal: true });

        this._myDoneTextComponent.alignment = WL.Alignment.Center;
        this._myDoneTextComponent.justification = WL.Justification.Line;
        this._myDoneTextComponent.material = this._myTextMaterial.clone();
        this._myDoneTextComponent.material.color = this._myNormalColor;
        this._myDoneTextComponent.text = " ";
        //this._myDoneTextComponent.text = "End";

        this._myTextsObject.pp_setPositionLocal(PP.vec3_create(0, 4.3, 0));
        this._myTextsObject.pp_setScale(2.75);

        this._myTriangleTextObject.pp_setPositionLocal(PP.vec3_create(-1.4, 0, 0));
        this._myPlaneTextObject.pp_setPositionLocal(PP.vec3_create(0.55, 0, 0));
        this._myFPSTextObject.pp_setPositionLocal(PP.vec3_create(-0.315, 0, 0));
        this._myDoneTextObject.pp_setPositionLocal(PP.vec3_create(0, -4.6, 0));
        this._myDoneTextObject.pp_setScale(4);

        this._myDTHistory = [];
    },
    update(dt) {
        if (this._mySessionStarted) {
            if (this._myStartTimer.isRunning()) {
                this._myStartTimer.update(dt);

                this._myDTHistory.push(dt);

                if (this._myStartTimer.isDone()) {
                    this._myStableFrameRate = this._computeAverageFrameRate(true);
                    if (this._myTargetFrameRate > 0) {
                        this._myStableFrameRate = this._myTargetFrameRate;
                    }

                    if (this._myEnableLog) {
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
            this._mySessionStarted = WL.xrSession != null;
        }
    },
    _computeAverageFrameRate(isStart) {
        let frameRate = 0;

        this._myDTHistory.sort();
        let elementToRemove = Math.floor(this._myDTHistory.length) * Math.min(0.9, this._myDTHistoryToIgnorePercentage * (isStart ? 2 : 1));
        for (let i = 0; i < elementToRemove; i++) {
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
    },
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

        let meshParams = new PP.MeshCreationParams();

        for (let i = 0; i < row + 1; i++) {
            for (let j = 0; j < column + 1; j++) {

                let x = (2 / column) * j;
                let y = (2 / row) * i;

                let vertexParams = new PP.MeshCreationVertexParams();

                vertexParams.myPosition = new PP.vec3_create();
                vertexParams.myPosition[0] = x - 1;
                vertexParams.myPosition[1] = y - 1;
                vertexParams.myPosition[2] = 0;

                vertexParams.myTextureCoordinates = new PP.vec2_create();
                vertexParams.myTextureCoordinates[0] = x / 2;
                vertexParams.myTextureCoordinates[1] = y / 2;

                vertexParams.myNormal = new PP.vec3_create();
                vertexParams.myNormal[0] = 0;
                vertexParams.myNormal[1] = 0;
                vertexParams.myNormal[2] = 1;

                meshParams.myVertexes.push(vertexParams);
            }
        }

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                let firstTriangle = new PP.MeshCreationTriangleParams();
                firstTriangle.myIndexes[0] = (i * (column + 1)) + j;
                firstTriangle.myIndexes[1] = (i * (column + 1)) + j + 1;
                firstTriangle.myIndexes[2] = ((i + 1) * (column + 1)) + j;

                let secondTriangle = new PP.MeshCreationTriangleParams();
                secondTriangle.myIndexes[0] = ((i + 1) * (column + 1)) + j;
                secondTriangle.myIndexes[1] = (i * (column + 1)) + j + 1;
                secondTriangle.myIndexes[2] = ((i + 1) * (column + 1)) + j + 1;

                meshParams.myTriangles.push(firstTriangle);
                meshParams.myTriangles.push(secondTriangle);
            }
        }

        let mesh = PP.MeshUtils.createMesh(meshParams);

        return mesh;
    }
});