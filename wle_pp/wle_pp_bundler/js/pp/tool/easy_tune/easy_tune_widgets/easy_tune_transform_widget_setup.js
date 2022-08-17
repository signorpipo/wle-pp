PP.EasyTuneTransformWidgetSetup = class EasyTuneTransformWidgetSetup {

    constructor() {
        this._initializeBuildSetup();
        this._initializeRuntimeSetup();
    }

    _initializeBuildSetup() {
        //General
        this.myBackgroundColor = [46 / 255, 46 / 255, 46 / 255, 1];

        this.myCursorTargetCollisionCollider = 2; // box
        this.myCursorTargetCollisionGroup = 7;
        this.myCursorTargetCollisionThickness = 0.001;

        this.myDefaultTextColor = [255 / 255, 255 / 255, 255 / 255, 1];

        this.myTextAlignment = 2; // center
        this.myTextJustification = 2; // middle
        this.myTextColor = this.myDefaultTextColor;

        //Pivot
        this.myPivotObjectPositions = [];
        this.myPivotObjectPositions[PP.ToolHandedness.NONE] = [0, 0, 0];
        this.myPivotObjectPositions[PP.ToolHandedness.LEFT] = [-0.04, 0.02, 0.00003713]; //little "random" z offset to avoid glitching with other widgets
        this.myPivotObjectPositions[PP.ToolHandedness.RIGHT] = [-0.08, 0.02, 0.00003713];

        let panelZ = 0.01;
        let distanceFromBorder = 0.0125;
        let distanceFromValue = 0.055;
        let colliderZPosition = 0.017;
        let backgroundHalfWidth = 0.2;

        this.mySideButtonBackgroundScale = [0.015, 0.015, 1];
        this.mySideButtonTextScale = [0.18, 0.18, 0.18];
        this.mySideButtonTextPosition = [0, 0, 0.007];

        this.mySideButtonCursorTargetPosition = [0, 0, 0];
        this.mySideButtonCursorTargetPosition[2] = colliderZPosition - panelZ;
        this.mySideButtonCollisionExtents = this.mySideButtonBackgroundScale.slice(0);
        this.mySideButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myLeftSideButtonPosition = [-0.13, 0, 0];
        this.myRightSideButtonPosition = [-this.myLeftSideButtonPosition[0], 0, 0];

        this.myPreviousButtonPosition = [0, 0, -0.00001];
        this.myPreviousButtonPosition[0] = -backgroundHalfWidth + this.mySideButtonBackgroundScale[0] + distanceFromBorder;

        this.myNextButtonPosition = [0, 0, -0.00001];
        this.myNextButtonPosition[0] = backgroundHalfWidth - this.mySideButtonBackgroundScale[0] - distanceFromBorder;

        this.myIncreaseButtonText = "+";
        this.myDecreaseButtonText = "-";

        //Display
        this.myDisplayPanelPosition = [0, 0.1, 0];

        this.myVariableLabelPanelPosition = [0, 0.025, panelZ];
        this.myVariableLabelTextScale = [0.19, 0.19, 0.19];

        this.myVariableLabelCursorTargetPosition = [0, 0, 0];
        this.myVariableLabelCursorTargetPosition[2] = colliderZPosition - panelZ;
        this.myVariableLabelCollisionExtents = [0.065, 0.0175, 1];
        this.myVariableLabelCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myNextButtonText = ">";
        this.myPreviousButtonText = "<";

        let distanceBetweenComponents = Math.abs(this.myNextButtonPosition[0]) + Math.abs(this.myRightSideButtonPosition[0]);
        let distanceFromVariableLabel = 0.045;
        this.myPositionPanelPosition = [0, this.myVariableLabelPanelPosition[1] - distanceFromVariableLabel, panelZ];
        this.myRotationPanelPosition = [this.myPositionPanelPosition[0] + distanceBetweenComponents, this.myVariableLabelPanelPosition[1] - distanceFromVariableLabel, panelZ];
        this.myScalePanelPosition = [this.myPositionPanelPosition[0] - distanceBetweenComponents, this.myVariableLabelPanelPosition[1] - distanceFromVariableLabel, panelZ];

        this.myPositionText = "Position";
        this.myRotationText = "Rotation";
        this.myScaleText = "Scale";

        this.myComponentLabelTextScale = [0.19, 0.19, 0.19];
        this.myComponentLabelCursorTargetPosition = [0, 0, 0];
        this.myComponentLabelCursorTargetPosition[2] = colliderZPosition - panelZ;
        this.myComponentLabelCollisionExtents = [0.065, 0.0175, 1];
        this.myComponentLabelCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myValueTextScale = [0.4, 0.4, 0.4];

        this.myValueCursorTargetPosition = [0, 0.0, 0];
        this.myValueCursorTargetPosition[2] = colliderZPosition - panelZ;
        this.myValueCollisionExtents = [0.065, 0.02, 1];
        this.myValueCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        let distanceBetweenValues = this.mySideButtonBackgroundScale[1] * 2 + 0.015;

        this.myValuePanelsPositions = [];
        this.myValuePanelsPositions[0] = [0, -distanceFromValue, 0];
        for (let i = 1; i < 3; i++) {
            this.myValuePanelsPositions[i] = this.myValuePanelsPositions[i - 1].slice(0);
            this.myValuePanelsPositions[i][1] -= distanceBetweenValues;
        }

        //Step
        let valuePanelLastPosition = this.myValuePanelsPositions[2][1];
        this.myStepPanelPosition = [0, valuePanelLastPosition - distanceFromValue, 0];
        this.myStepTextScale = [0.19, 0.19, 0.19];
        this.myStepStartString = "Step: ";

        this.myStepCursorTargetPosition = [0, 0, 0];
        this.myStepCursorTargetPosition[2] = colliderZPosition - this.myStepPanelPosition[2];
        this.myStepCollisionExtents = [0.065, 0.0175, 1];
        this.myStepCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        //Background
        {
            let maxY = this.myDisplayPanelPosition[1] + this.myVariableLabelPanelPosition[1] + this.mySideButtonBackgroundScale[1] + distanceFromBorder * 1.25;
            let minY = this.myDisplayPanelPosition[1] + this.myPositionPanelPosition[1] + this.myStepPanelPosition[1] - distanceFromBorder * 1.25 - this.mySideButtonBackgroundScale[1];

            let maxX = this.myDisplayPanelPosition[0] + this.myRotationPanelPosition[0] + this.myRightSideButtonPosition[0] + this.mySideButtonBackgroundScale[0] + distanceFromBorder;
            let minX = this.myDisplayPanelPosition[0] + this.myScalePanelPosition[0] + this.myLeftSideButtonPosition[0] - this.mySideButtonBackgroundScale[0] - distanceFromBorder;

            this.myBackPanelPosition = [(maxX + minX) / 2, (maxY + minY) / 2, 0];
            this.myBackBackgroundScale = [(maxX - minX) / 2, (maxY - minY) / 2, 1];
            this.myBackBackgroundColor = [70 / 255, 70 / 255, 70 / 255, 1];
        }

        //Pointer
        this.myPointerCollisionExtents = this.myBackBackgroundScale.slice(0);
        this.myPointerCollisionExtents[2] = this.myCursorTargetCollisionThickness;
        this.myPointerCursorTargetPosition = this.myBackPanelPosition.slice(0);
        this.myPointerCursorTargetPosition[2] = colliderZPosition - 0.0001; // a little behind the button target to avoid hiding it
    }

    _initializeRuntimeSetup() {
        this.myButtonHoverColor = [150 / 255, 150 / 255, 150 / 255, 1];
        this.myTextHoverScaleMultiplier = [1.25, 1.25, 1.25];

        this.myEditThumbstickMinThreshold = 0.35;
        this.myStepMultiplierStepPerSecond = 2.25;
        this.myButtonEditDelay = 0;

        this.myScrollVariableDelay = 0.5;
    }
};