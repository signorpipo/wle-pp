import { Alignment, Collider, VerticalAlignment } from "@wonderlandengine/api";
import { quat_create, vec3_create, vec4_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { ToolHandedness, ToolInputSourceType } from "../cauldron/tool_types.js";

export class WidgetFrameConfig {

    constructor(widgetLetterID, buttonsColumnIndex) {

        this._setupBuildConfig(widgetLetterID, buttonsColumnIndex);
        this._setupRuntimeConfig();
    }

    _setupBuildConfig(widgetLetterID, buttonsColumnIndex) {
        // General
        this.myBackgroundColor = vec4_create(46 / 255, 46 / 255, 46 / 255, 1);

        this.myCursorTargetCollisionCollider = Collider.Box;
        this.myCursorTargetCollisionGroup = 7;  // Keep this in sync with Tool Cursor
        this.myCursorTargetCollisionThickness = 0.001;

        this.myDefaultTextColor = vec4_create(255 / 255, 255 / 255, 255 / 255, 1);

        this.myTextAlignment = Alignment.Center;
        this.myTextVerticalAlignment = VerticalAlignment.Middle;
        this.myTextColor = this.myDefaultTextColor;

        this.myButtonTextScale = vec3_create(0.18, 0.18, 0.18);

        this.myVisibilityButtonBackgroundScale = vec3_create(0.015, 0.015, 1);
        this.myVisibilityButtonTextPosition = vec3_create(0, 0, 0.007);
        this.myVisibilityButtonTextScale = this.myButtonTextScale;

        let distanceBetweenToolsVisibilityButtons = 0.01;
        let buttonXOffset = this.myVisibilityButtonBackgroundScale[0] * (2 * buttonsColumnIndex) + distanceBetweenToolsVisibilityButtons * buttonsColumnIndex;

        this.myVisibilityButtonPosition = [];
        this.myVisibilityButtonPosition[ToolHandedness.NONE] = {};
        this.myVisibilityButtonPosition[ToolHandedness.NONE].myPosition = vec3_create(-0.3 + buttonXOffset, -0.205, 0.035);

        this.myVisibilityButtonPosition[ToolHandedness.LEFT] = {};
        this.myVisibilityButtonPosition[ToolHandedness.LEFT].myPosition = vec3_create(-0.2 + buttonXOffset, 0.025, 0.015);

        this.myVisibilityButtonPosition[ToolHandedness.RIGHT] = {};
        this.myVisibilityButtonPosition[ToolHandedness.RIGHT].myPosition = vec3_create(0.2 - buttonXOffset, 0.025, 0.015);

        this.myVisibilityButtonText = widgetLetterID;

        this.myVisibilityButtonCursorTargetPosition = vec3_create(0, 0, 0);
        this.myVisibilityButtonCursorTargetPosition[2] = this.myVisibilityButtonTextPosition[2];
        this.myVisibilityButtonCollisionExtents = this.myVisibilityButtonBackgroundScale.pp_clone();
        this.myVisibilityButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myFlagButtonBackgroundScale = vec3_create(0.0125, 0.0125, 1);
        this.myFlagButtonTextPosition = vec3_create(0, 0, 0.007);
        this.myFlagButtonTextScale = vec3_create(0.15, 0.15, 0.15);

        let distanceBetweenFlagButtons = 0.0075;
        let pinFlagIndex = 0;
        let pinButtonYOffset = this.myVisibilityButtonBackgroundScale[1] + this.myFlagButtonBackgroundScale[1] + distanceBetweenFlagButtons +
            this.myFlagButtonBackgroundScale[1] * (2 * pinFlagIndex) + distanceBetweenFlagButtons * pinFlagIndex;

        this.myPinButtonPosition = [];
        this.myPinButtonPosition[ToolHandedness.NONE] = {};
        this.myPinButtonPosition[ToolHandedness.NONE].myPosition = this.myVisibilityButtonPosition[ToolHandedness.NONE].myPosition.pp_clone();
        this.myPinButtonPosition[ToolHandedness.NONE].myPosition[1] += pinButtonYOffset;

        this.myPinButtonPosition[ToolHandedness.LEFT] = {};
        this.myPinButtonPosition[ToolHandedness.LEFT].myPosition = this.myVisibilityButtonPosition[ToolHandedness.LEFT].myPosition.pp_clone();
        this.myPinButtonPosition[ToolHandedness.LEFT].myPosition[1] += pinButtonYOffset;

        this.myPinButtonPosition[ToolHandedness.RIGHT] = {};
        this.myPinButtonPosition[ToolHandedness.RIGHT].myPosition = this.myVisibilityButtonPosition[ToolHandedness.RIGHT].myPosition.pp_clone();
        this.myPinButtonPosition[ToolHandedness.RIGHT].myPosition[1] += pinButtonYOffset;

        this.myPinButtonText = "P";

        this.myPinButtonCursorTargetPosition = vec3_create(0, 0, 0);
        this.myPinButtonCursorTargetPosition[2] = this.myFlagButtonTextPosition[2];
        this.myPinButtonCollisionExtents = this.myFlagButtonBackgroundScale.pp_clone();
        this.myPinButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;
    }

    _setupRuntimeConfig() {
        this._initializeObjectsTransforms();

        this.myButtonHoverColor = vec4_create(150 / 255, 150 / 255, 150 / 255, 1);
        this.myButtonDisabledTextColor = this.myBackgroundColor;
        this.myButtonDisabledBackgroundColor = vec4_create(110 / 255, 110 / 255, 110 / 255, 1);
    }

    _initializeObjectsTransforms() {
        this.myPivotObjectTransforms = this._createDefaultObjectTransforms();

        this.myPivotObjectTransforms[ToolInputSourceType.GAMEPAD][ToolHandedness.LEFT].myRotation = quat_create(-0.645, 0.425, 0.25, 0.584);
        this.myPivotObjectTransforms[ToolInputSourceType.GAMEPAD][ToolHandedness.LEFT].myRotation.quat_normalize(this.myPivotObjectTransforms[ToolInputSourceType.GAMEPAD][ToolHandedness.LEFT].myRotation);

        this.myPivotObjectTransforms[ToolInputSourceType.GAMEPAD][ToolHandedness.RIGHT].myRotation = quat_create(-0.645, -0.425, -0.25, 0.584);
        this.myPivotObjectTransforms[ToolInputSourceType.GAMEPAD][ToolHandedness.RIGHT].myRotation.quat_normalize(this.myPivotObjectTransforms[ToolInputSourceType.GAMEPAD][ToolHandedness.RIGHT].myRotation);

        this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.LEFT].myRotation = quat_create(-0.645, 0.425, 0.25, 0.584);
        this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.LEFT].myRotation.quat_normalize(this.myPivotObjectTransforms[ToolInputSourceType.GAMEPAD][ToolHandedness.LEFT].myRotation);

        this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.RIGHT].myRotation = quat_create(-0.645, -0.425, -0.25, 0.584);
        this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.RIGHT].myRotation.quat_normalize(this.myPivotObjectTransforms[ToolInputSourceType.GAMEPAD][ToolHandedness.RIGHT].myRotation);

        /*
        this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.LEFT].myPosition = vec3_create(-0.04, 0.045, -0.055);
        this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.LEFT].myRotation = quat_create(0, 0.536, -0.43, 0.727);
        this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.LEFT].myRotation.quat_normalize(this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.LEFT].myRotation);

        this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.RIGHT].myPosition = vec3_create(0.04, 0.045, -0.055);
        this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.RIGHT].myRotation = quat_create(0, -0.536, 0.43, 0.727);
        this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.RIGHT].myRotation.quat_normalize(this.myPivotObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.RIGHT].myRotation);
        */

        this.myWidgetObjectTransforms = this._createDefaultObjectTransforms();

        this.myWidgetObjectTransforms[ToolInputSourceType.GAMEPAD][ToolHandedness.LEFT].myPosition = vec3_create(0.1, 0.23, -0.02);
        this.myWidgetObjectTransforms[ToolInputSourceType.GAMEPAD][ToolHandedness.RIGHT].myPosition = vec3_create(0.07, 0.23, -0.02);

        this.myWidgetObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.LEFT].myPosition = vec3_create(0.1, 0.23, -0.02);
        this.myWidgetObjectTransforms[ToolInputSourceType.TRACKED_HAND][ToolHandedness.RIGHT].myPosition = vec3_create(0.07, 0.23, -0.02);

        this._myPivotObjectDistanceFromHeadNonXR = 0.6;
    }

    _createDefaultObjectTransforms() {
        let defaultObjectTransforms = [];

        for (let inputSourceTypeKey in ToolInputSourceType) {
            let inputSourceType = ToolInputSourceType[inputSourceTypeKey];
            defaultObjectTransforms[inputSourceType] = [];
            for (let handednessKey in ToolHandedness) {
                let handedness = ToolHandedness[handednessKey];
                defaultObjectTransforms[inputSourceType][handedness] = {};
                defaultObjectTransforms[inputSourceType][handedness].myPosition = vec3_create(0, 0, 0);
                defaultObjectTransforms[inputSourceType][handedness].myRotation = quat_create(0, 0, 0, 1);
            }
        }

        return defaultObjectTransforms;
    }
}