PP.EasyTuneBaseWidgetSetup = class EasyTuneBaseWidgetSetup {

    constructor() {
    }

    build() {
        this._initializeBuildSetup();
        this._initializeRuntimeSetup();
    }

    // Hooks

    _getBackPanelMaxY() {
        return this.myDisplayPanelPosition[1] + this.myVariableLabelPanelPosition[1] + this.mySideButtonBackgroundScale[1] + this._mySideButtonDistanceFromBorder * 1.25;
    }

    _getBackPanelMinY() {
        return this.myDisplayPanelPosition[1] - this._mySideButtonDistanceFromBorder * 1.25 - this.mySideButtonBackgroundScale[1];
    }

    _getBackPanelMaxX() {
        return this._mySideButtonPanelHalfWidth
    }

    _getBackPanelMinX() {
        return -this._mySideButtonPanelHalfWidth;
    }

    // small Z offset to avoid glitching with other widgets
    _getPivotZOffset() {
        return 0;
    }

    _initializeBuildSetupHook() {
    }

    _initializeRuntimeSetupHook() {
    }

    // Hooks end

    _initializeBuildSetup() {
        // General

        this.myBackgroundColor = [46 / 255, 46 / 255, 46 / 255, 1];

        this.myCursorTargetCollisionCollider = WL.Collider.Box;
        this.myCursorTargetCollisionGroup = 7;
        this.myCursorTargetCollisionThickness = 0.001;

        this.myDefaultTextColor = [255 / 255, 255 / 255, 255 / 255, 1];

        this.myTextAlignment = WL.Alignment.Center;
        this.myTextJustification = WL.Justification.Middle;
        this.myTextColor = this.myDefaultTextColor;

        this.myLabelTextScale = PP.vec3_create(0.19, 0.19, 0.19);
        this.myButtonTextScale = PP.vec3_create(0.18, 0.18, 0.18);

        this._myPanelZOffset = 0.01;
        this._myColliderZOffset = 0.017;
        this._mySideButtonDistanceFromBorder = 0.0125;
        this._mySideButtonPanelHalfWidth = 0.2;

        // Pivot

        this.myPivotObjectPositions = [];
        this.myPivotObjectPositions[PP.ToolHandedness.NONE] = PP.vec3_create(0, 0, this._getPivotZOffset());
        this.myPivotObjectPositions[PP.ToolHandedness.LEFT] = PP.vec3_create(-0.04, 0.02, this._getPivotZOffset());
        this.myPivotObjectPositions[PP.ToolHandedness.RIGHT] = PP.vec3_create(-0.08, 0.02, this._getPivotZOffset());

        this.mySideButtonBackgroundScale = PP.vec3_create(0.015, 0.015, 1);
        this.mySideButtonTextScale = this.myButtonTextScale;
        this.mySideButtonTextPosition = PP.vec3_create(0, 0, 0.007);

        this.mySideButtonCursorTargetPosition = PP.vec3_create(0, 0, 0);
        this.mySideButtonCursorTargetPosition[2] = this._myColliderZOffset - this._myPanelZOffset;
        this.mySideButtonCollisionExtents = this.mySideButtonBackgroundScale.slice(0);
        this.mySideButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myLeftSideButtonPosition = PP.vec3_create(0, 0, -0.00001);
        this.myLeftSideButtonPosition[0] = -this._mySideButtonPanelHalfWidth + this.mySideButtonBackgroundScale[0] + this._mySideButtonDistanceFromBorder;

        this.myRightSideButtonPosition = PP.vec3_create(0, 0, -0.00001);
        this.myRightSideButtonPosition[0] = -this.myLeftSideButtonPosition[0];

        // Display

        this.myDisplayPanelPosition = PP.vec3_create(0, 0.1, 0);

        this.myVariableLabelPanelPosition = PP.vec3_create(0, 0.025, this._myPanelZOffset);
        this.myVariableLabelTextScale = this.myLabelTextScale;

        this.myVariableLabelCursorTargetPosition = PP.vec3_create(0, 0, 0);
        this.myVariableLabelCursorTargetPosition[2] = this._myColliderZOffset - this._myPanelZOffset;
        this.myVariableLabelCollisionExtents = PP.vec3_create(0.065, 0.0175, 1);
        this.myVariableLabelCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myNextButtonText = ">";
        this.myPreviousButtonText = "<";

        this._initializeBuildSetupHook();

        // Background

        {
            let maxX = this._getBackPanelMaxX();
            let minX = this._getBackPanelMinX();
            let maxY = this._getBackPanelMaxY();
            let minY = this._getBackPanelMinY();

            this.myBackPanelPosition = [(maxX + minX) / 2, (maxY + minY) / 2, 0];
            this.myBackBackgroundScale = [(maxX - minX) / 2, (maxY - minY) / 2, 1];

            this.myBackBackgroundColor = [70 / 255, 70 / 255, 70 / 255, 1];
        }

        // Import Export

        this.myImportExportButtonBackgroundScale = PP.vec3_create(0.04, 0.02, 1);
        this.myImportExportButtonTextScale = this.myButtonTextScale;
        this.myImportExportButtonTextPosition = PP.vec3_create(0, 0, 0.007);

        this.myImportExportPanelPosition = [0, this._getBackPanelMaxY() + this._mySideButtonDistanceFromBorder + this.myImportExportButtonBackgroundScale[1], this._myPanelZOffset];

        this.myImportExportButtonCursorTargetPosition = PP.vec3_create(0, 0, 0);
        this.myImportExportButtonCursorTargetPosition[2] = this._myColliderZOffset - this._myPanelZOffset;
        this.myImportExportButtonCollisionExtents = this.myImportExportButtonBackgroundScale.slice(0);
        this.myImportExportButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myImportButtonText = "Import";
        this.myExportButtonText = "Export";

        this.myImportExportResetLabelSeconds = 2;

        this.myImportingButtonText = "...";
        this.myImportSuccessButtonText = "Done";
        this.myImportFailureButtonText = "Error";

        this.myExportingButtonText = "...";
        this.myExportSuccessButtonText = "Done";
        this.myExportFailureButtonText = "Error";

        this.myImportButtonPosition = PP.vec3_create(0, 0, -0.00001);
        this.myImportButtonPosition[0] = -this.myImportExportButtonBackgroundScale[0] - this._mySideButtonDistanceFromBorder / 2;

        this.myExportButtonPosition = PP.vec3_create(0, 0, -0.00001);
        this.myExportButtonPosition[0] = -this.myImportButtonPosition[0];


        // Pointer

        this.myPointerCollisionExtents = this.myBackBackgroundScale.slice(0);
        this.myPointerCollisionExtents[2] = this.myCursorTargetCollisionThickness;
        this.myPointerCursorTargetPosition = this.myBackPanelPosition.slice(0);
        this.myPointerCursorTargetPosition[2] = this._myColliderZOffset - 0.0001; // a little behind the button target to avoid hiding it
    }

    _initializeRuntimeSetup() {
        this.myButtonHoverColor = [150 / 255, 150 / 255, 150 / 255, 1];

        this.myScrollVariableDelay = 0.5;

        this._initializeRuntimeSetupHook();
    }
};