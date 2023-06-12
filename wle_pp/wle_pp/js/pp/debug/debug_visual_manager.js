import { Alignment, Justification } from "@wonderlandengine/api";
import { XRUtils } from "../cauldron/utils/xr_utils";
import { VisualArrowParams } from "../cauldron/visual/elements/visual_arrow";
import { VisualLineParams } from "../cauldron/visual/elements/visual_line";
import { VisualPointParams } from "../cauldron/visual/elements/visual_point";
import { VisualRaycastParams } from "../cauldron/visual/elements/visual_raycast";
import { VisualTextParams } from "../cauldron/visual/elements/visual_text";
import { VisualTransformParams } from "../cauldron/visual/elements/visual_transform";
import { VisualManager } from "../cauldron/visual/visual_manager";
import { mat4_create, quat_create, vec3_create, vec4_create } from "../plugin/js/extensions/array_extension";
import { Globals } from "../pp/globals";

export class DebugVisualManager extends VisualManager {

    constructor(engine) {
        super(engine);

        this._myDefaultColor = vec4_create(1, 0, 1, 1);
        this._myDefaultLineThickness = 0.005;
        this._myDefaultPointRadius = 0.01;
        this._myDefaultAxisLength = 0.2;

        this._myDefaultTextLookAtPlayer = true;
        this._myDefaultTextAlignment = Alignment.Center;
        this._myDefaultTextJustification = Justification.Middle;

        this._myDefaultUITextAlignment = Alignment.Center;
        this._myDefaultUITextJustification = Justification.Middle;
        this._myDefaultUITextScale = 1;

        this._myDefaultUITextScreenPosition = vec3_create(1, 1, 1);
    }

    drawLine(lifetimeSeconds, start, direction, length, color = this._myDefaultColor, thickness = this._myDefaultLineThickness) {
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

    drawLineEnd(lifetimeSeconds, start, end, color = this._myDefaultColor, thickness = this._myDefaultLineThickness) {
        // Implemented outside class definition
    }

    drawArrow(lifetimeSeconds, start, direction, length, color = this._myDefaultColor, thickness = this._myDefaultLineThickness) {
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

    drawArrowEnd(lifetimeSeconds, start, end, color = this._myDefaultColor, thickness = this._myDefaultLineThickness) {
        // Implemented outside class definition
    }

    drawPoint(lifetimeSeconds, position, color = this._myDefaultColor, radius = this._myDefaultPointRadius) {
        if (this.isActive()) {
            let visualParams = new VisualPointParams(this._myEngine);
            visualParams.myPosition.vec3_copy(position);
            visualParams.myRadius = radius;
            visualParams.myColor = vec4_create();
            visualParams.myColor.vec4_copy(color);
            this.draw(visualParams, lifetimeSeconds);
        }
    }

    drawText(lifetimeSeconds, text, transform, color = this._myDefaultColor, lookAtPlayer = this._myDefaultTextLookAtPlayer, alignment = this._myDefaultTextAlignment, justification = this._myDefaultTextJustification) {
        if (this.isActive()) {
            let visualParams = new VisualTextParams(this._myEngine);
            visualParams.myText = text;
            visualParams.myAlignment = alignment;
            visualParams.myJustification = justification;
            visualParams.myTransform.mat4_copy(transform);
            visualParams.myColor = vec4_create();
            visualParams.myColor.vec4_copy(color);

            if (lookAtPlayer) {
                visualParams.myLookAtObject = Globals.getPlayerObjects(this._myEngine).myHead;
            }

            this.draw(visualParams, lifetimeSeconds);
        }
    }

    drawRaycast(lifetimeSeconds, raycastResult, showOnlyFirstHit = true, hitNormalLength = this._myDefaultAxisLength, thickness = this._myDefaultLineThickness) {
        if (this.isActive()) {
            let visualParams = new VisualRaycastParams(this._myEngine);
            visualParams.myRaycastResults = raycastResult;
            visualParams.myShowOnlyFirstHit = showOnlyFirstHit;
            visualParams.myHitNormalLength = hitNormalLength;
            visualParams.myThickness = thickness;
            this.draw(visualParams, lifetimeSeconds);
        }
    }

    drawTransform(lifetimeSeconds, transform, length = this._myDefaultAxisLength, thickness = this._myDefaultLineThickness) {
        if (this.isActive()) {
            let visualParams = new VisualTransformParams(this._myEngine);
            visualParams.myTransform.mat4_copy(transform);
            visualParams.myLength = length;
            visualParams.myThickness = thickness;
            this.draw(visualParams, lifetimeSeconds);
        }
    }

    drawUIText(lifetimeSeconds, text, screenPosition, scale = this._myDefaultUITextScale, color = this._myDefaultColor, alignment = this._myDefaultUITextAlignment, justification = this._myDefaultUITextJustification) {
        // Implemented outside class definition
    }

    _getClassName() {
        return "debug_visual_manager";
    }
}



// IMPLEMENTATION

DebugVisualManager.prototype.drawLineEnd = function () {
    let direction = vec3_create();
    return function drawLineEnd(lifetimeSeconds, start, end, color = this._myDefaultColor, thickness = this._myDefaultLineThickness) {
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
    return function drawArrowEnd(lifetimeSeconds, start, end, color = this._myDefaultColor, thickness = this._myDefaultLineThickness) {
        if (this.isActive()) {
            direction = end.vec3_sub(start, direction);
            length = direction.vec3_length();
            direction.vec3_normalize(direction);
            this.drawArrow(lifetimeSeconds, start, direction, length, color, thickness);
        }
    };
}();

DebugVisualManager.prototype.drawUIText = function () {
    let textRotationQuat = quat_create();
    let up = vec3_create(0, 1, 0);
    let lookToForward = vec3_create();

    let screenPositionNormalizedXR = vec3_create(-0.115 * 1, 0.115 * 1, 0.35);
    let screenPositionNormalizedNonXR = vec3_create(-0.25 * 1.15, 0.130 * 1.05, 0.35);

    let textPosition = vec3_create();
    let textRotation = vec3_create();
    let textScale = vec3_create();
    return function drawUIText(lifetimeSeconds, text, screenPosition = this._myDefaultUITextScreenPosition, scale = this._myDefaultUITextScale, color = this._myDefaultColor, alignment = this._myDefaultUITextAlignment, justification = this._myDefaultUITextJustification) {
        if (this.isActive()) {
            let visualParams = new VisualTextParams(this._myEngine);
            visualParams.myText = text;
            visualParams.myAlignment = alignment;
            visualParams.myJustification = justification;
            visualParams.myColor = vec4_create();
            visualParams.myColor.vec4_copy(color);

            let scaleNormalized = 0.2;

            if (XRUtils.isSessionActive(this._myEngine)) {
                visualParams.myTransform.mat4_setPositionRotationScale(
                    screenPositionNormalizedXR.vec3_mul(screenPosition, textPosition),
                    textRotation.vec3_set(0, 180, 0),
                    textScale.vec3_set(scaleNormalized * scale, scaleNormalized * scale, scaleNormalized * scale));

                lookToForward = visualParams.myTransform.mat4_getPosition(lookToForward).vec3_negate(lookToForward).vec3_normalize(lookToForward);
                textRotationQuat = visualParams.myTransform.mat4_getRotationQuat(textRotationQuat);
                textRotationQuat.quat_setForward(lookToForward, up, textRotationQuat);
                visualParams.myTransform.mat4_setRotationQuat(textRotationQuat);
            } else {
                visualParams.myTransform.mat4_setPositionRotationScale(
                    screenPositionNormalizedNonXR.vec3_mul(screenPosition, textPosition),
                    textRotation.vec3_set(0, 180, 0),
                    textScale.vec3_set(scaleNormalized * scale, scaleNormalized * scale, scaleNormalized * scale));
            }

            visualParams.myParent = Globals.getPlayerObjects(this._myEngine).myHeadDebugs;
            visualParams.myLocal = true;

            this.draw(visualParams, lifetimeSeconds);
        }
    };
}();