PP.PlayerLocomotionTeleportDetectionVisualizerParams = class PlayerLocomotionTeleportDetectionVisualizerParams {
    constructor() {
        this.myTeleportParableValidMaterial = null;
        this.myTeleportParableInvalidMaterial = null;

        this.myTeleportPositionObject = null;

        this.myTeleportParableLineEndOffset = 0.05;
        this.myTeleportParableMinVerticalDistanceToShowVerticalLine = 0.25;

        this.myTeleportParablePositionUpOffset = 0.05;

        this.myTeleportParablePositionVisualAlignOnSurface = true;

        this.myVisualTeleportPositionLerpActive = true;
        this.myVisualTeleportPositionLerpFactor = 10;
        this.myVisualTeleportPositionMinDistanceToResetLerp = 0.005;
        this.myVisualTeleportPositionMinDistanceToLerp = 0.15;
        this.myVisualTeleportPositionMaxDistanceToLerp = 5;

        this.myVisualTeleportPositionMinDistanceToCloseLerpFactor = 0.02;
        this.myVisualTeleportPositionCloseLerpFactor = 30;

        this.myVisualTeleportPositionMinAngleDistanceToResetLerp = 0.1;
        this.myVisualTeleportPositionMinAngleDistanceToLerp = 1;
        this.myVisualTeleportPositionMaxAngleDistanceToLerp = 180;
    }
};

PP.PlayerLocomotionTeleportDetectionVisualizer = class PlayerLocomotionTeleportDetectionVisualizer {
    constructor(teleportParams, teleportRuntimeParams, detectionRuntimeParams) {
        this._myDetectionRuntimeParams = detectionRuntimeParams;

        this._myTeleportParams = teleportParams;
        this._myTeleportRuntimeParams = teleportRuntimeParams;

        this._myVisualTeleportTransformQuatReset = true;
        this._myVisualTeleportTransformQuat = PP.quat2_create();
        this._myVisualTeleportTransformPositionLerping = false;
        this._myVisualTeleportTransformRotationLerping = false;

        //PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Teleport Min Distance Lerp", this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMinDistanceToLerp, 1, 3, 0));
        //PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Teleport Max Distance Lerp", this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMaxDistanceToLerp, 1, 3, 0));
        //PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Teleport Min Angle Distance Lerp", this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMinAngleDistanceToLerp, 10, 3, 0));
        //PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Teleport Max Angle Distance Lerp", this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMaxAngleDistanceToLerp, 10, 3, 0));

        this._setupVisuals();
    }

    start() {

    }

    end() {
        this._myVisualTeleportTransformQuatReset = true;
        this._myVisualTeleportTransformPositionLerping = false;
        this._myVisualTeleportTransformRotationLerping = false;

        this._hideTeleportPosition();
    }

    update(dt) {
        //this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMinDistanceToLerp = PP.myEasyTuneVariables.get("Teleport Min Distance Lerp");
        //this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMaxDistanceToLerp = PP.myEasyTuneVariables.get("Teleport Max Distance Lerp");
        //this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMinAngleDistanceToLerp = PP.myEasyTuneVariables.get("Teleport Min Angle Distance Lerp");
        //this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMaxAngleDistanceToLerp = PP.myEasyTuneVariables.get("Teleport Max Angle Distance Lerp");

        if (this._myDetectionRuntimeParams.myTeleportDetectionValid) {
            this._showTeleportPosition(dt);
        } else {
            this._myVisualTeleportTransformQuatReset = true;
            this._myVisualTeleportTransformPositionLerping = false;
            this._myVisualTeleportTransformRotationLerping = false;
            this._hideTeleportPosition();
        }
    }

    _showTeleportPosition(dt) {
        this._hideTeleportPosition();

        this._showTeleportParable(dt);
    }

    _hideTeleportPosition() {
        for (let visualLine of this._myValidVisualLines) {
            visualLine.setVisible(false);
        }

        for (let visualLine of this._myInvalidVisualLines) {
            visualLine.setVisible(false);
        }

        this._myValidVisualPoint.setVisible(false);
        this._myInvalidVisualPoint.setVisible(false);

        this._myValidVisualVerticalLine.setVisible(false);

        this._myValidVisualTeleportPositionTorus.setVisible(false);
        this._myValidVisualTeleportPositionTorusInner.setVisible(false);

        if (this._myTeleportParams.myVisualizerParams.myTeleportPositionObject != null) {
            this._myTeleportParams.myVisualizerParams.myTeleportPositionObject.pp_setActive(false);
        }
    }

    _addVisualLines(amount) {
        for (let i = 0; i < amount; i++) {
            {
                let visualParams = new PP.VisualLineParams();

                if (this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial != null) {
                    visualParams.myMaterial = this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial;
                } else {
                    visualParams.myMaterial = this._myTeleportParableValidMaterial;
                }

                this._myValidVisualLines.push(new PP.VisualLine(visualParams));
            }

            {
                let visualParams = new PP.VisualLineParams();

                if (this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial != null) {
                    visualParams.myMaterial = this._myTeleportParams.myVisualizerParams.myTeleportParableInvalidMaterial;
                } else {
                    visualParams.myMaterial = this._myTeleportParableInvalidMaterial;
                }

                this._myInvalidVisualLines.push(new PP.VisualLine(visualParams));
            }
        }
    }
};

PP.PlayerLocomotionTeleportDetectionVisualizer.prototype._setupVisuals = function () {
    let innerTorusPosition = PP.vec3_create();
    return function _setupVisuals() {
        this._myTeleportParableValidMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
        this._myTeleportParableValidMaterial.color = PP.vec4_create(0, 0.5, 1, 1);
        this._myTeleportParableInvalidMaterial = PP.myDefaultResources.myMaterials.myFlatOpaque.clone();
        this._myTeleportParableInvalidMaterial.color = PP.vec4_create(0.75, 0.05, 0, 1);

        this._myValidVisualLines = [];
        this._myInvalidVisualLines = [];
        this._addVisualLines(30);

        {
            let visualParams = new PP.VisualPointParams();

            if (this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial != null) {
                visualParams.myMaterial = this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial;
            } else {
                visualParams.myMaterial = this._myTeleportParableValidMaterial;
            }

            this._myValidVisualPoint = new PP.VisualPoint(visualParams);
        }

        {
            let visualParams = new PP.VisualPointParams();

            if (this._myTeleportParams.myVisualizerParams.myTeleportParableInvalidMaterial != null) {
                visualParams.myMaterial = this._myTeleportParams.myVisualizerParams.myTeleportParableInvalidMaterial;
            } else {
                visualParams.myMaterial = this._myTeleportParableInvalidMaterial;
            }

            this._myInvalidVisualPoint = new PP.VisualPoint(visualParams);
        }

        {
            let visualParams = new PP.VisualLineParams();

            if (this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial != null) {
                visualParams.myMaterial = this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial;
            } else {
                visualParams.myMaterial = this._myTeleportParableValidMaterial;
            }

            this._myValidVisualVerticalLine = new PP.VisualLine(visualParams);
        }

        this._myVisualTeleportPositionObject = PP.myVisualData.myRootObject.pp_addObject();

        //PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Teleport Torus Radius", 0.175, 0.1, 3));
        //PP.myEasyTuneVariables.add(new PP.EasyTuneInt("Teleport Torus Segments", 24, 1));
        //PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Teleport Torus Thickness", 0.02, 0.1, 3));

        //PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Teleport Torus Inner Radius", 0.04, 0.1, 3));

        {
            let visualParams = new PP.VisualTorusParams();
            visualParams.myRadius = 0.175;
            visualParams.mySegmentsAmount = 24;
            visualParams.mySegmentThickness = 0.02;

            //visualParams.myRadius = PP.myEasyTuneVariables.get("Teleport Torus Radius");
            //visualParams.mySegmentsAmount = PP.myEasyTuneVariables.get("Teleport Torus Segments");
            //visualParams.mySegmentThickness = PP.myEasyTuneVariables.get("Teleport Torus Thickness");

            if (this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial != null) {
                visualParams.myMaterial = this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial;
            } else {
                visualParams.myMaterial = this._myTeleportParableValidMaterial;
            }

            visualParams.myParent = this._myVisualTeleportPositionObject;
            visualParams.myIsLocal = true;

            this._myValidVisualTeleportPositionTorus = new PP.VisualTorus(visualParams);
        }

        {
            let visualParams = new PP.VisualTorusParams();
            visualParams.myRadius = 0.04;
            visualParams.mySegmentsAmount = 24;
            visualParams.mySegmentThickness = 0.02;

            //visualParams.myRadius = PP.myEasyTuneVariables.get("Teleport Torus Inner Radius");
            //visualParams.mySegmentsAmount = PP.myEasyTuneVariables.get("Teleport Torus Segments");
            //visualParams.mySegmentThickness = PP.myEasyTuneVariables.get("Teleport Torus Thickness");

            if (this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial != null) {
                visualParams.myMaterial = this._myTeleportParams.myVisualizerParams.myTeleportParableValidMaterial;
            } else {
                visualParams.myMaterial = this._myTeleportParableValidMaterial;
            }

            visualParams.myParent = this._myVisualTeleportPositionObject;
            visualParams.myIsLocal = true;

            let visualTorusParams = this._myValidVisualTeleportPositionTorus.getParams();

            let innerTorusCenter = (visualTorusParams.myRadius - (visualTorusParams.mySegmentThickness / 2)) / 2;
            innerTorusPosition.vec3_set(0, 0, innerTorusCenter);

            visualParams.myTransform.mat4_setPosition(innerTorusPosition);

            this._myValidVisualTeleportPositionTorusInner = new PP.VisualTorus(visualParams);
        }

        if (this._myTeleportParams.myVisualizerParams.myTeleportPositionObject != null) {
            this._myTeleportParams.myVisualizerParams.myTeleportPositionObject.pp_setParent(this._myVisualTeleportPositionObject);
            this._myTeleportParams.myVisualizerParams.myTeleportPositionObject.pp_resetTransformLocal();
            this._myTeleportParams.myVisualizerParams.myTeleportPositionObject.pp_setActive(false);
        }

        this._hideTeleportPosition();
    };
}();

PP.PlayerLocomotionTeleportDetectionVisualizer.prototype._showTeleportParable = function () {
    let currentPosition = PP.vec3_create();
    let nextPosition = PP.vec3_create();

    let playerUp = PP.vec3_create();
    let upDifference = PP.vec3_create();
    return function _showTeleportParable(dt) {
        let showParableDistance = Math.max(this._myDetectionRuntimeParams.myParableDistance - this._myTeleportParams.myVisualizerParams.myTeleportParableLineEndOffset);
        let lastParableIndex = this._myDetectionRuntimeParams.myParable.getPositionIndexByDistance(showParableDistance);
        let lastParableIndexDistance = this._myDetectionRuntimeParams.myParable.getDistance(lastParableIndex);

        if (lastParableIndex + 1 > this._myValidVisualLines.length) {
            this._addVisualLines(lastParableIndex + 1, this._myValidVisualLines.length);
        }

        for (let i = 0; i <= lastParableIndex; i++) {
            currentPosition = this._myDetectionRuntimeParams.myParable.getPosition(i, currentPosition);
            nextPosition = this._myDetectionRuntimeParams.myParable.getPosition(i + 1, nextPosition);

            let visuaLine = (this._myDetectionRuntimeParams.myTeleportPositionValid) ? this._myValidVisualLines[i] : this._myInvalidVisualLines[i];

            let currentVisualLineParams = visuaLine.getParams();

            if (i == lastParableIndex) {
                let stepLength = Math.max(0, showParableDistance - lastParableIndexDistance);
                nextPosition = nextPosition.vec3_sub(currentPosition, nextPosition).vec3_normalize(nextPosition);
                nextPosition = currentPosition.vec3_add(nextPosition.vec3_scale(stepLength, nextPosition), nextPosition);
            }

            currentVisualLineParams.setStartEnd(currentPosition, nextPosition);
            currentVisualLineParams.myThickness = 0.005;

            visuaLine.paramsUpdated();
            visuaLine.setVisible(true);

            if (this._myTeleportParams.myDebugActive && this._myTeleportParams.myDebugShowActive) {
                PP.myDebugVisualManager.drawPoint(0, currentPosition, PP.vec4_create(1, 0, 0, 1), 0.01);
            }
        }

        let visualPoint = (this._myDetectionRuntimeParams.myTeleportPositionValid) ? this._myValidVisualPoint : this._myInvalidVisualPoint;
        let visualPointParams = visualPoint.getParams();
        visualPointParams.myPosition.vec3_copy(nextPosition);
        visualPointParams.myRadius = 0.01;
        visualPoint.paramsUpdated();
        visualPoint.setVisible(true);

        if (this._myDetectionRuntimeParams.myTeleportPositionValid) {
            playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);

            upDifference = nextPosition.vec3_sub(this._myTeleportRuntimeParams.myTeleportPosition, upDifference).vec3_componentAlongAxis(playerUp, upDifference);
            let upDistance = upDifference.vec3_length();
            if (upDistance >= this._myTeleportParams.myVisualizerParams.myTeleportParableMinVerticalDistanceToShowVerticalLine) {
                let lineLength = Math.min(upDistance - this._myTeleportParams.myVisualizerParams.myTeleportParableMinVerticalDistanceToShowVerticalLine, this._myTeleportParams.myVisualizerParams.myTeleportParableMinVerticalDistanceToShowVerticalLine);

                let visualLineParams = this._myValidVisualVerticalLine.getParams();

                visualLineParams.myStart.vec3_copy(nextPosition);
                visualLineParams.myDirection = playerUp.vec3_negate(visualLineParams.myDirection);
                visualLineParams.myLength = lineLength;
                visualLineParams.myThickness = 0.005;

                this._myValidVisualVerticalLine.paramsUpdated();
                this._myValidVisualVerticalLine.setVisible(true);

            }

            this._showTeleportParablePosition(dt);
        } else {
            this._myVisualTeleportTransformQuatReset = true;
            this._myVisualTeleportTransformPositionLerping = false;
            this._myVisualTeleportTransformRotationLerping = false;
        }
    };
}();

PP.PlayerLocomotionTeleportDetectionVisualizer.prototype._showTeleportParablePosition = function () {
    let playerUp = PP.vec3_create();
    let feetTransformQuat = PP.quat2_create();
    let feetRotationQuat = PP.quat_create();

    let visualPosition = PP.vec3_create();
    let visualForward = PP.vec3_create();
    let visualRotationQuat = PP.quat_create();

    let currentVisualTeleportTransformQuat = PP.quat2_create();
    let currentVisualTeleportPosition = PP.vec3_create();
    let currentVisualTeleportRotationQuat = PP.quat_create();
    let differenceRotationQuat = PP.quat_create();

    return function _showTeleportParablePosition(dt) {
        playerUp = this._myTeleportParams.myPlayerHeadManager.getPlayer().pp_getUp(playerUp);
        feetTransformQuat = this._myTeleportParams.myPlayerHeadManager.getTransformFeetQuat(feetTransformQuat);
        feetRotationQuat = feetTransformQuat.quat2_getRotationQuat(feetRotationQuat);
        feetRotationQuat = feetRotationQuat.quat_rotateAxis(this._myTeleportRuntimeParams.myTeleportRotationOnUp, playerUp, feetRotationQuat);
        visualForward = feetRotationQuat.quat_getForward(visualForward);

        visualPosition = this._myTeleportRuntimeParams.myTeleportPosition.vec3_add(playerUp.vec3_scale(this._myTeleportParams.myVisualizerParams.myTeleportParablePositionUpOffset, visualPosition), visualPosition);

        if (this._myTeleportParams.myVisualizerParams.myTeleportParablePositionVisualAlignOnSurface) {
            visualRotationQuat.quat_setUp(this._myDetectionRuntimeParams.myTeleportSurfaceNormal, visualForward);
        } else {
            visualRotationQuat.quat_setUp(playerUp, visualForward);
        }

        this._myVisualTeleportTransformQuat.quat2_setPositionRotationQuat(visualPosition, visualRotationQuat);

        if (this._myVisualTeleportTransformQuatReset || !this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionLerpActive) {
            this._myVisualTeleportPositionObject.pp_setTransformQuat(this._myVisualTeleportTransformQuat);
            this._myVisualTeleportTransformQuatReset = false;
        } else {
            currentVisualTeleportTransformQuat = this._myVisualTeleportPositionObject.pp_getTransformQuat(currentVisualTeleportTransformQuat);
            currentVisualTeleportPosition = currentVisualTeleportTransformQuat.quat2_getPosition(currentVisualTeleportPosition);
            currentVisualTeleportRotationQuat = currentVisualTeleportTransformQuat.quat2_getRotationQuat(currentVisualTeleportRotationQuat);
            currentVisualTeleportRotationQuat.quat_rotationToQuat(visualRotationQuat, differenceRotationQuat);

            let positionDistance = currentVisualTeleportPosition.vec3_distance(visualPosition);
            let rotationAngleDistance = differenceRotationQuat.quat_getAngle();

            if ((!this._myVisualTeleportTransformPositionLerping || positionDistance < this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMinDistanceToResetLerp) &&
                (positionDistance < this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMinDistanceToLerp ||
                    positionDistance > this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMaxDistanceToLerp)) {
                this._myVisualTeleportTransformPositionLerping = false;
                currentVisualTeleportPosition.vec3_copy(visualPosition);
            } else {
                this._myVisualTeleportTransformPositionLerping = true;

                let interpolationValue = this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionLerpFactor * dt;
                if (positionDistance < this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMinDistanceToCloseLerpFactor) {
                    interpolationValue = this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionCloseLerpFactor * dt;
                }
                currentVisualTeleportPosition.vec3_lerp(visualPosition, interpolationValue, currentVisualTeleportPosition);
            }

            if ((!this._myVisualTeleportTransformRotationLerping || rotationAngleDistance < this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMinAngleDistanceToResetLerp) &&
                (rotationAngleDistance < this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMinAngleDistanceToLerp ||
                    positionDistance > this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionMaxAngleDistanceToLerp)) {
                this._myVisualTeleportTransformRotationLerping = false;
                currentVisualTeleportRotationQuat.quat_copy(visualRotationQuat);
            } else {
                let interpolationValue = this._myTeleportParams.myVisualizerParams.myVisualTeleportPositionLerpFactor * dt;

                this._myVisualTeleportTransformRotationLerping = true;
                currentVisualTeleportRotationQuat.quat_slerp(visualRotationQuat, interpolationValue, currentVisualTeleportRotationQuat);
            }

            currentVisualTeleportTransformQuat.quat2_setPositionRotationQuat(currentVisualTeleportPosition, currentVisualTeleportRotationQuat);
            this._myVisualTeleportPositionObject.pp_setTransformQuat(currentVisualTeleportTransformQuat);
        }

        {
            let visualParams = this._myValidVisualTeleportPositionTorus.getParams();
            visualParams.myRadius = 0.175;
            visualParams.mySegmentsAmount = 24;
            visualParams.mySegmentThickness = 0.02;

            //visualParams.myRadius = PP.myEasyTuneVariables.get("Teleport Torus Radius");
            //visualParams.mySegmentsAmount = PP.myEasyTuneVariables.get("Teleport Torus Segments");
            //visualParams.mySegmentThickness = PP.myEasyTuneVariables.get("Teleport Torus Thickness");

            this._myValidVisualTeleportPositionTorus.paramsUpdated();
        }

        {
            let visualParams = this._myValidVisualTeleportPositionTorusInner.getParams();
            visualParams.myRadius = 0.04;
            visualParams.mySegmentsAmount = 24;
            visualParams.mySegmentThickness = 0.02;

            //visualParams.myRadius = PP.myEasyTuneVariables.get("Teleport Torus Inner Radius");
            //visualParams.mySegmentsAmount = PP.myEasyTuneVariables.get("Teleport Torus Segments");
            //visualParams.mySegmentThickness = PP.myEasyTuneVariables.get("Teleport Torus Thickness");

            this._myValidVisualTeleportPositionTorusInner.paramsUpdated();
        }

        if (this._myTeleportParams.myVisualizerParams.myTeleportPositionObject == null) {
            this._myValidVisualTeleportPositionTorus.setVisible(true);
            this._myValidVisualTeleportPositionTorusInner.setVisible(true);
        } else {
            this._myValidVisualTeleportPositionTorus.setVisible(false);
            this._myValidVisualTeleportPositionTorusInner.setVisible(false);
            this._myTeleportParams.myVisualizerParams.myTeleportPositionObject.pp_setActive(true);
        }

        if (this._myTeleportParams.myDebugActive && this._myTeleportParams.myDebugShowActive) {
            PP.myDebugVisualManager.drawPoint(0, this._myTeleportRuntimeParams.myTeleportPosition, PP.vec4_create(0, 0, 1, 1), 0.02);
        }
    };
}();