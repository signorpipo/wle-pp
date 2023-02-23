PP.DebugVisualManager = class DebugVisualManager extends PP.VisualManager {
    drawLine(lifetimeSeconds, start, direction, length, color = PP.vec4_create(0, 1, 0, 1), thickness = 0.005) {
        let visualParams = new PP.VisualLineParams();
        visualParams.myStart.vec3_copy(start);
        visualParams.myDirection.vec3_copy(direction);
        visualParams.myLength = length;
        visualParams.myThickness = thickness;
        visualParams.myColor = PP.vec4_create();
        visualParams.myColor.vec4_copy(color);
        this.draw(visualParams, lifetimeSeconds);
    }

    drawLineEnd(lifetimeSeconds, start, end, color = PP.vec4_create(0, 1, 0, 1), thickness = 0.005) {
        // implemented outside class definition
    }

    drawArrow(lifetimeSeconds, start, direction, length, color = PP.vec4_create(0, 1, 0, 1), thickness = 0.005) {
        let visualParams = new PP.VisualArrowParams();
        visualParams.myStart.vec3_copy(start);
        visualParams.myDirection.vec3_copy(direction);
        visualParams.myLength = length;
        visualParams.myThickness = thickness;
        visualParams.myColor = PP.vec4_create();
        visualParams.myColor.vec4_copy(color);
        this.draw(visualParams, lifetimeSeconds);
    }

    drawArrowEnd(lifetimeSeconds, start, end, color = PP.vec4_create(0, 1, 0, 1), thickness = 0.005) {
        // implemented outside class definition
    }

    drawPoint(lifetimeSeconds, position, color = PP.vec4_create(0, 1, 0, 1), radius = 0.005) {
        let visualParams = new PP.VisualPointParams();
        visualParams.myPosition.vec3_copy(position);
        visualParams.myRadius = radius;
        visualParams.myColor = PP.vec4_create();
        visualParams.myColor.vec4_copy(color);
        this.draw(visualParams, lifetimeSeconds);
    }

    drawText(lifetimeSeconds, text, transform, color = PP.vec4_create(0, 1, 0, 1), alignment = WL.Alignment.Center, justification = WL.Justification.Middle) {
        let visualParams = new PP.VisualTextParams();
        visualParams.myText = text;
        visualParams.myAlignment = alignment;
        visualParams.myJustification = justification;
        visualParams.myTransform.mat4_copy(transform);
        visualParams.myColor = PP.vec4_create();
        visualParams.myColor.vec4_copy(color);
        this.draw(visualParams, lifetimeSeconds);
    }

    drawRaycast(lifetimeSeconds, raycastResult, showOnlyFirstHit = true, hitNormalLength = 0.2, thickness = 0.005) {
        let visualParams = new PP.VisualRaycastParams();
        visualParams.myRaycastResults = raycastResult;
        visualParams.myShowOnlyFirstHit = showOnlyFirstHit;
        visualParams.myHitNormalLength = hitNormalLength;
        visualParams.myThickness = thickness;
        this.draw(visualParams, lifetimeSeconds);
    }

    drawTransform(lifetimeSeconds, transform, length = 0.2, thickness = 0.005) {
        let visualParams = new PP.VisualTransformParams();
        visualParams.myTransform.mat4_copy(transform);
        visualParams.myLength = length;
        visualParams.myThickness = thickness;
        this.draw(visualParams, lifetimeSeconds);
    }
};

PP.DebugVisualManager.prototype.drawLineEnd = function () {
    let direction = PP.vec3_create();
    return function drawLineEnd(lifetimeSeconds, start, end, color = PP.vec4_create(0, 1, 0, 1), thickness = 0.005) {
        direction = end.vec3_sub(start, direction);
        length = direction.vec3_length();
        direction.vec3_normalize(direction);
        this.drawLine(lifetimeSeconds, start, direction, length, color, thickness);
    };
}();

PP.DebugVisualManager.prototype.drawArrowEnd = function () {
    let direction = PP.vec3_create();
    return function drawArrowEnd(lifetimeSeconds, start, end, color = PP.vec4_create(0, 1, 0, 1), thickness = 0.005) {
        direction = end.vec3_sub(start, direction);
        length = direction.vec3_length();
        direction.vec3_normalize(direction);
        this.drawArrow(lifetimeSeconds, start, direction, length, color, thickness);
    };
}();



Object.defineProperty(PP.DebugVisualManager.prototype, "drawLineEnd", { enumerable: false });
Object.defineProperty(PP.DebugVisualManager.prototype, "drawArrowEnd", { enumerable: false });