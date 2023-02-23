PP.WidgetFrameSetup = class WidgetFrameSetup {

    constructor(widgetLetterID, buttonsColumnIndex) {

        this._initializeBuildSetup(widgetLetterID, buttonsColumnIndex);
        this._initializeRuntimeSetup();
    }

    _initializeBuildSetup(widgetLetterID, buttonsColumnIndex) {
        //General
        this.myBackgroundColor = [46 / 255, 46 / 255, 46 / 255, 1];

        this.myCursorTargetCollisionCollider = 2; // box
        this.myCursorTargetCollisionGroup = 7;
        this.myCursorTargetCollisionThickness = 0.001;

        this.myDefaultTextColor = [255 / 255, 255 / 255, 255 / 255, 1];

        this.myTextAlignment = 2; // center
        this.myTextJustification = 2; // middle
        this.myTextColor = this.myDefaultTextColor;

        this.myButtonTextScale = PP.vec3_create(0.18, 0.18, 0.18);

        this.myVisibilityButtonBackgroundScale = PP.vec3_create(0.015, 0.015, 1);
        this.myVisibilityButtonTextPosition = PP.vec3_create(0, 0, 0.007);
        this.myVisibilityButtonTextScale = this.myButtonTextScale;

        let distanceBetweenToolsVisibilityButtons = 0.01;
        let buttonXOffset = this.myVisibilityButtonBackgroundScale[0] * (2 * buttonsColumnIndex) + distanceBetweenToolsVisibilityButtons * buttonsColumnIndex;

        this.myVisibilityButtonPosition = [];
        this.myVisibilityButtonPosition[PP.ToolHandedness.NONE] = {};
        this.myVisibilityButtonPosition[PP.ToolHandedness.NONE].myPosition = [-0.3 + buttonXOffset, -0.205, 0.035];

        this.myVisibilityButtonPosition[PP.ToolHandedness.LEFT] = {};
        this.myVisibilityButtonPosition[PP.ToolHandedness.LEFT].myPosition = [-0.2 + buttonXOffset, 0.025, 0.015];

        this.myVisibilityButtonPosition[PP.ToolHandedness.RIGHT] = {};
        this.myVisibilityButtonPosition[PP.ToolHandedness.RIGHT].myPosition = [0.2 - buttonXOffset, 0.025, 0.015];

        this.myVisibilityButtonText = widgetLetterID;

        this.myVisibilityButtonCursorTargetPosition = PP.vec3_create(0, 0, 0);
        this.myVisibilityButtonCursorTargetPosition[2] = this.myVisibilityButtonTextPosition[2];
        this.myVisibilityButtonCollisionExtents = this.myVisibilityButtonBackgroundScale.slice(0);
        this.myVisibilityButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myFlagButtonBackgroundScale = PP.vec3_create(0.0125, 0.0125, 1);
        this.myFlagButtonTextPosition = PP.vec3_create(0, 0, 0.007);
        this.myFlagButtonTextScale = PP.vec3_create(0.15, 0.15, 0.15);

        let distanceBetweenFlagButtons = 0.0075;
        let pinFlagIndex = 0;
        let pinButtonYOffset = this.myVisibilityButtonBackgroundScale[1] + this.myFlagButtonBackgroundScale[1] + distanceBetweenFlagButtons +
            this.myFlagButtonBackgroundScale[1] * (2 * pinFlagIndex) + distanceBetweenFlagButtons * pinFlagIndex;

        this.myPinButtonPosition = [];
        this.myPinButtonPosition[PP.ToolHandedness.NONE] = {};
        this.myPinButtonPosition[PP.ToolHandedness.NONE].myPosition = this.myVisibilityButtonPosition[PP.ToolHandedness.NONE].myPosition.slice(0);
        this.myPinButtonPosition[PP.ToolHandedness.NONE].myPosition[1] += pinButtonYOffset;

        this.myPinButtonPosition[PP.ToolHandedness.LEFT] = {};
        this.myPinButtonPosition[PP.ToolHandedness.LEFT].myPosition = this.myVisibilityButtonPosition[PP.ToolHandedness.LEFT].myPosition.slice(0);
        this.myPinButtonPosition[PP.ToolHandedness.LEFT].myPosition[1] += pinButtonYOffset;

        this.myPinButtonPosition[PP.ToolHandedness.RIGHT] = {};
        this.myPinButtonPosition[PP.ToolHandedness.RIGHT].myPosition = this.myVisibilityButtonPosition[PP.ToolHandedness.RIGHT].myPosition.slice(0);
        this.myPinButtonPosition[PP.ToolHandedness.RIGHT].myPosition[1] += pinButtonYOffset;

        this.myPinButtonText = "P";

        this.myPinButtonCursorTargetPosition = PP.vec3_create(0, 0, 0);
        this.myPinButtonCursorTargetPosition[2] = this.myFlagButtonTextPosition[2];
        this.myPinButtonCollisionExtents = this.myFlagButtonBackgroundScale.slice(0);
        this.myPinButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;
    }

    _initializeRuntimeSetup() {
        this._initializeObjectsTransforms();

        this.myButtonHoverColor = [150 / 255, 150 / 255, 150 / 255, 1];
        this.myButtonDisabledTextColor = this.myBackgroundColor;
        this.myButtonDisabledBackgroundColor = [110 / 255, 110 / 255, 110 / 255, 1];
    }

    _initializeObjectsTransforms() {
        this.myPivotObjectTransforms = this._createDefaultObjectTransforms();

        this.myPivotObjectTransforms[PP.ToolInputSourceType.GAMEPAD][PP.ToolHandedness.LEFT].myRotation = PP.quat_create(-0.645, 0.425, 0.25, 0.584);
        this.myPivotObjectTransforms[PP.ToolInputSourceType.GAMEPAD][PP.ToolHandedness.LEFT].myRotation.quat_normalize(this.myPivotObjectTransforms[PP.ToolInputSourceType.GAMEPAD][PP.ToolHandedness.LEFT].myRotation);

        this.myPivotObjectTransforms[PP.ToolInputSourceType.GAMEPAD][PP.ToolHandedness.RIGHT].myRotation = PP.quat_create(-0.645, -0.425, -0.25, 0.584);
        this.myPivotObjectTransforms[PP.ToolInputSourceType.GAMEPAD][PP.ToolHandedness.RIGHT].myRotation.quat_normalize(this.myPivotObjectTransforms[PP.ToolInputSourceType.GAMEPAD][PP.ToolHandedness.RIGHT].myRotation);

        this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.LEFT].myRotation = PP.quat_create(-0.645, 0.425, 0.25, 0.584);
        this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.LEFT].myRotation.quat_normalize(this.myPivotObjectTransforms[PP.ToolInputSourceType.GAMEPAD][PP.ToolHandedness.LEFT].myRotation);

        this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.RIGHT].myRotation = PP.quat_create(-0.645, -0.425, -0.25, 0.584);
        this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.RIGHT].myRotation.quat_normalize(this.myPivotObjectTransforms[PP.ToolInputSourceType.GAMEPAD][PP.ToolHandedness.RIGHT].myRotation);

        /*
        this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.LEFT].myPosition = PP.vec3_create(-0.04, 0.045, -0.055);
        this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.LEFT].myRotation = PP.quat_create(0, 0.536, -0.43, 0.727);
        this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.LEFT].myRotation.quat_normalize(this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.LEFT].myRotation);

        this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.RIGHT].myPosition = PP.vec3_create(0.04, 0.045, -0.055);
        this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.RIGHT].myRotation = PP.quat_create(0, -0.536, 0.43, 0.727);
        this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.RIGHT].myRotation.quat_normalize(this.myPivotObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.RIGHT].myRotation);
        */

        this.myWidgetObjectTransforms = this._createDefaultObjectTransforms();

        this.myWidgetObjectTransforms[PP.ToolInputSourceType.GAMEPAD][PP.ToolHandedness.LEFT].myPosition = PP.vec3_create(0.1, 0.23, -0.02);
        this.myWidgetObjectTransforms[PP.ToolInputSourceType.GAMEPAD][PP.ToolHandedness.RIGHT].myPosition = PP.vec3_create(0.07, 0.23, -0.02);

        this.myWidgetObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.LEFT].myPosition = PP.vec3_create(0.1, 0.23, -0.02);
        this.myWidgetObjectTransforms[PP.ToolInputSourceType.TRACKED_HAND][PP.ToolHandedness.RIGHT].myPosition = PP.vec3_create(0.07, 0.23, -0.02);

        this._myPivotObjectDistanceFromNonVRHead = 0.6;
    }

    _createDefaultObjectTransforms() {
        let defaultObjectTransforms = [];

        for (let inputSourceTypeKey in PP.ToolInputSourceType) {
            let inputSourceType = PP.ToolInputSourceType[inputSourceTypeKey];
            defaultObjectTransforms[inputSourceType] = [];
            for (let handednessKey in PP.ToolHandedness) {
                let handedness = PP.ToolHandedness[handednessKey];
                defaultObjectTransforms[inputSourceType][handedness] = {};
                defaultObjectTransforms[inputSourceType][handedness].myPosition = PP.vec3_create(0, 0, 0);
                defaultObjectTransforms[inputSourceType][handedness].myRotation = PP.quat_create(0, 0, 0, 1);
            }
        }

        return defaultObjectTransforms;
    }
};