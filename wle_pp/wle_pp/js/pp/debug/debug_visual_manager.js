import { Alignment, Justification } from "@wonderlandengine/api";
import { VisualArrowParams } from "../cauldron/visual/elements/visual_arrow";
import { VisualLineParams } from "../cauldron/visual/elements/visual_line";
import { VisualPointParams } from "../cauldron/visual/elements/visual_point";
import { VisualRaycastParams } from "../cauldron/visual/elements/visual_raycast";
import { VisualTextParams } from "../cauldron/visual/elements/visual_text";
import { VisualTransformParams } from "../cauldron/visual/elements/visual_transform";
import { VisualManager } from "../cauldron/visual/visual_manager";
import { vec3_create, vec4_create } from "../plugin/js/extensions/array_extension";

export class DebugVisualManager extends VisualManager {

    constructor(engine) {
        super(engine);
    }

    drawLine(lifetimeSeconds, start, direction, length, color = vec4_create(0, 1, 0, 1), thickness = 0.005) {
        if (this.isActive()) {
            let visualParams = new VisualLineParams(this._myEngine);
            visualParams.myStart.vec3_copy(start);
            visualParams.myDirection.vec3_copy(direction);
            visualParams.myLength = length;
            visualParams.myThickness = thickness;
            visualParams.myColor = vec4_create();
            visualParams.myColor.vec4_copy(color);
            this.draw(visualParams, lifetimeSeconds);
        }
    }

    drawLineEnd(lifetimeSeconds, start, end, color = vec4_create(0, 1, 0, 1), thickness = 0.005) {
        // Implemented outside class definition
    }

    drawArrow(lifetimeSeconds, start, direction, length, color = vec4_create(0, 1, 0, 1), thickness = 0.005) {
        if (this.isActive()) {
            let visualParams = new VisualArrowParams(this._myEngine);
            visualParams.myStart.vec3_copy(start);
            visualParams.myDirection.vec3_copy(direction);
            visualParams.myLength = length;
            visualParams.myThickness = thickness;
            visualParams.myColor = vec4_create();
            visualParams.myColor.vec4_copy(color);
            this.draw(visualParams, lifetimeSeconds);
        }
    }

    drawArrowEnd(lifetimeSeconds, start, end, color = vec4_create(0, 1, 0, 1), thickness = 0.005) {
        // Implemented outside class definition
    }

    drawPoint(lifetimeSeconds, position, color = vec4_create(0, 1, 0, 1), radius = 0.005) {
        if (this.isActive()) {
            let visualParams = new VisualPointParams(this._myEngine);
            visualParams.myPosition.vec3_copy(position);
            visualParams.myRadius = radius;
            visualParams.myColor = vec4_create();
            visualParams.myColor.vec4_copy(color);
            this.draw(visualParams, lifetimeSeconds);
        }
    }

    drawText(lifetimeSeconds, text, transform, color = vec4_create(0, 1, 0, 1), alignment = Alignment.Center, justification = Justification.Middle) {
        if (this.isActive()) {
            let visualParams = new VisualTextParams(this._myEngine);
            visualParams.myText = text;
            visualParams.myAlignment = alignment;
            visualParams.myJustification = justification;
            visualParams.myTransform.mat4_copy(transform);
            visualParams.myColor = vec4_create();
            visualParams.myColor.vec4_copy(color);
            this.draw(visualParams, lifetimeSeconds);
        }
    }

    drawRaycast(lifetimeSeconds, raycastResult, showOnlyFirstHit = true, hitNormalLength = 0.2, thickness = 0.005) {
        if (this.isActive()) {
            let visualParams = new VisualRaycastParams(this._myEngine);
            visualParams.myRaycastResults = raycastResult;
            visualParams.myShowOnlyFirstHit = showOnlyFirstHit;
            visualParams.myHitNormalLength = hitNormalLength;
            visualParams.myThickness = thickness;
            this.draw(visualParams, lifetimeSeconds);
        }
    }

    drawTransform(lifetimeSeconds, transform, length = 0.2, thickness = 0.005) {
        if (this.isActive()) {
            let visualParams = new VisualTransformParams(this._myEngine);
            visualParams.myTransform.mat4_copy(transform);
            visualParams.myLength = length;
            visualParams.myThickness = thickness;
            this.draw(visualParams, lifetimeSeconds);
        }
    }
}

DebugVisualManager.prototype.drawLineEnd = function () {
    let direction = vec3_create();
    return function drawLineEnd(lifetimeSeconds, start, end, color = vec4_create(0, 1, 0, 1), thickness = 0.005) {
        if (this.isActive()) {
            direction = end.vec3_sub(start, direction);
            length = direction.vec3_length();
            direction.vec3_normalize(direction);
            this.drawLine(lifetimeSeconds, start, direction, length, color, thickness);
        }
    };
}();

DebugVisualManager.prototype.drawArrowEnd = function () {
    let direction = vec3_create();
    return function drawArrowEnd(lifetimeSeconds, start, end, color = vec4_create(0, 1, 0, 1), thickness = 0.005) {
        if (this.isActive()) {
            direction = end.vec3_sub(start, direction);
            length = direction.vec3_length();
            direction.vec3_normalize(direction);
            this.drawArrow(lifetimeSeconds, start, direction, length, color, thickness);
        }
    };
}();