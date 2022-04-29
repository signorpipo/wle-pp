PP.DebugLine = class DebugLine {

    constructor(autoRefresh = true) {
        this._myLineRootObject = null;
        this._myLineObject = null;

        this._myStartPosition = [0, 0, 0];
        this._myDirection = [0, 0, 1];
        this._myLength = 0;

        this._myThickness = 0.005;

        this._myColor = [0.7, 0.7, 0.7, 1];

        this._myVisible = true;

        this._myDirty = false;

        this._myAutoRefresh = autoRefresh;

        this._buildLine();
    }

    setVisible(visible) {
        if (this._myVisible != visible) {
            this._myVisible = visible;
            this._myLineRootObject.pp_setActiveHierarchy(visible);
        }
    }

    setAutoRefresh(autoRefresh) {
        this._myAutoRefresh = autoRefresh;
    }

    setStartEnd(start, end) {
        let direction = [];
        glMatrix.vec3.sub(direction, end, start);
        let length = glMatrix.vec3.length(direction);
        glMatrix.vec3.normalize(direction, direction);

        this.setStartDirectionLength(start, direction, length);
    }

    setStartDirectionLength(start, direction, length) {
        this._myStartPosition.vec3_copy(start);
        this._myDirection.vec3_copy(direction);
        this._myLength = length;

        this._markDirty();
    }

    setColor(color) {
        glMatrix.vec4.copy(this._myColor, color);

        this._markDirty();
    }

    setThickness(thickness) {
        this._myThickness = thickness;

        this._markDirty();
    }

    update(dt) {
        if (this._myDirty) {
            this._refreshLine(dt);

            this._myDirty = false;
        }
    }

    _refreshLine(dt) {
        this._myLineRootObject.setTranslationWorld(this._myStartPosition);
        this._myLineObject.resetTranslationRotation();
        this._myLineObject.resetScaling();

        this._myLineObject.scale([this._myThickness / 2, this._myThickness / 2, this._myLength / 2]);

        let forward = this._myLineObject.pp_getForward();
        let angle = glMatrix.vec3.angle(forward, this._myDirection);
        if (angle > 0.0001) {
            let rotationAxis = [];
            glMatrix.vec3.cross(rotationAxis, forward, this._myDirection);
            glMatrix.vec3.normalize(rotationAxis, rotationAxis);
            let rotationQuat = [];
            glMatrix.quat.setAxisAngle(rotationQuat, rotationAxis, angle);

            glMatrix.quat.mul(rotationQuat, rotationQuat, this._myLineObject.transformWorld);
            glMatrix.quat.normalize(rotationQuat, rotationQuat);
            this._myLineObject.rotateObject(rotationQuat);
        }

        forward = this._myLineObject.pp_getForward();
        let position = this._myLineObject.pp_getPosition();
        glMatrix.vec3.scale(forward, forward, this._myLength / 2);
        glMatrix.vec3.add(position, forward, position);
        this._myLineObject.setTranslationWorld(position);

        this._myLineMesh.material.color = this._myColor;
    }

    _buildLine() {
        this._myLineRootObject = WL.scene.addObject(PP.myDebugData.myRootObject);
        this._myLineObject = WL.scene.addObject(this._myLineRootObject);
        this._myLineObject.scale([0.01, 0.01, 0.01]);

        this._myLineMesh = this._myLineObject.addComponent('mesh');
        this._myLineMesh.mesh = PP.myDebugData.myCubeMesh;
        this._myLineMesh.material = PP.myDebugData.myFlatMaterial.clone();
    }

    _markDirty() {
        this._myDirty = true;

        if (this._myAutoRefresh) {
            this._refreshLine(0);
        }
    }
};