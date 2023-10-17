import { Alignment, Collider, Justification } from "@wonderlandengine/api";
import { vec3_create, vec4_create } from "../../../../plugin/js/extensions/array_extension";
import { ToolHandedness } from "../../../cauldron/tool_types";

export class EasyTuneBaseWidgetConfig {

    constructor() {
    }

    build() {
        this._setupBuildConfig();
        this._setupRuntimeConfig();
    }

    // Hooks

    _getBackPanelMaxY() {
        return this.myDisplayPanelPosition[1] + this.myVariableLabelPanelPosition[1] + this.mySideButtonBackgroundScale[1] + this._mySideButtonDistanceFromBorder * 1.25;
    }

    _getBackPanelMinY() {
        return this.myDisplayPanelPosition[1] - this._mySideButtonDistanceFromBorder * 1.25 - this.mySideButtonBackgroundScale[1];
    }

    _getBackPanelMaxX() {
        return this._mySideButtonPanelHalfWidth;
    }

    _getBackPanelMinX() {
        return -this._mySideButtonPanelHalfWidth;
    }

    // Small Z offset to avoid glitching with other widgets
    _getPivotZOffset() {
        return 0;
    }

    _setupBuildConfigHook() {
    }

    _setupRuntimeConfigHook() {
    }

    // Hooks end

    _setupBuildConfig() {
        // General

        this.myBackgroundColor = vec4_create(46 / 255, 46 / 255, 46 / 255, 1);

        this.myCursorTargetCollisionCollider = Collider.Box;
        this.myCursorTargetCollisionGroup = 7;  // Keep this in sync with Tool Cursor
        this.myCursorTargetCollisionThickness = 0.001;

        this.myDefaultTextColor = vec4_create(255 / 255, 255 / 255, 255 / 255, 1);

        this.myTextAlignment = Alignment.Center;
        this.myTextJustification = Justification.Middle;
        this.myTextColor = this.myDefaultTextColor;

        this.myLabelTextScale = vec3_create(0.18, 0.18, 0.18);
        this.myButtonTextScale = vec3_create(0.18, 0.18, 0.18);

        this._myPanelZOffset = 0.01;
        this._myColliderZOffset = 0.017;
        this._mySideButtonDistanceFromBorder = 0.0125;
        this._mySideButtonPanelHalfWidth = 0.2;

        // Pivot

        this.myPivotObjectPositions = [];
        this.myPivotObjectPositions[ToolHandedness.NONE] = vec3_create(0, 0, this._getPivotZOffset());
        this.myPivotObjectPositions[ToolHandedness.LEFT] = vec3_create(-0.04, 0.02, this._getPivotZOffset());
        this.myPivotObjectPositions[ToolHandedness.RIGHT] = vec3_create(-0.08, 0.02, this._getPivotZOffset());

        this.mySideButtonBackgroundScale = vec3_create(0.015, 0.015, 1);
        this.mySideButtonTextScale = this.myButtonTextScale;
        this.mySideButtonTextPosition = vec3_create(0, 0, 0.007);

        this.mySideButtonCursorTargetPosition = vec3_create(0, 0, 0);
        this.mySideButtonCursorTargetPosition[2] = this._myColliderZOffset - this._myPanelZOffset;
        this.mySideButtonCollisionExtents = this.mySideButtonBackgroundScale.pp_clone();
        this.mySideButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myLeftSideButtonPosition = vec3_create(0, 0, -0.00001);
        this.myLeftSideButtonPosition[0] = -this._mySideButtonPanelHalfWidth + this.mySideButtonBackgroundScale[0] + this._mySideButtonDistanceFromBorder;

        this.myRightSideButtonPosition = vec3_create(0, 0, -0.00001);
        this.myRightSideButtonPosition[0] = -this.myLeftSideButtonPosition[0];

        // Display

        this.myDisplayPanelPosition = vec3_create(0, 0.1, 0);

        this.myVariableLabelPanelPosition = vec3_create(0, 0.025, this._myPanelZOffset);
        this.myVariableLabelTextScale = this.myLabelTextScale;

        this.myVariableLabelCursorTargetPosition = vec3_create(0, 0, 0);
        this.myVariableLabelCursorTargetPosition[2] = this._myColliderZOffset - this._myPanelZOffset;
        this.myVariableLabelCollisionExtents = vec3_create(0.065, 0.0175, 1);
        this.myVariableLabelCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myNextButtonText = ">";
        this.myPreviousButtonText = "<";

        this._setupBuildConfigHook();

        // Background

        {
            let maxX = this._getBackPanelMaxX();
            let minX = this._getBackPanelMinX();
            let maxY = this._getBackPanelMaxY();
            let minY = this._getBackPanelMinY();

            this.myBackPanelPosition = [(maxX + minX) / 2, (maxY + minY) / 2, 0];
            this.myBackBackgroundScale = [(maxX - minX) / 2, (maxY - minY) / 2, 1];

            this.myBackBackgroundColor = vec4_create(70 / 255, 70 / 255, 70 / 255, 1);
        }

        // Import Export

        this.myImportExportButtonBackgroundScale = vec3_create(0.04, 0.02, 1);
        this.myImportExportButtonTextScale = this.myButtonTextScale;
        this.myImportExportButtonTextPosition = vec3_create(0, 0, 0.007);

        this.myImportExportPanelPosition = [0, this._getBackPanelMaxY() + this._mySideButtonDistanceFromBorder + this.myImportExportButtonBackgroundScale[1], this._myPanelZOffset];

        this.myImportExportButtonCursorTargetPosition = vec3_create(0, 0, 0);
        this.myImportExportButtonCursorTargetPosition[2] = this._myColliderZOffset - this._myPanelZOffset;
        this.myImportExportButtonCollisionExtents = this.myImportExportButtonBackgroundScale.pp_clone();
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

        this.myImportButtonPosition = vec3_create(0, 0, -0.00001);
        this.myImportButtonPosition[0] = -this.myImportExportButtonBackgroundScale[0] - this._mySideButtonDistanceFromBorder / 2;

        this.myExportButtonPosition = vec3_create(0, 0, -0.00001);
        this.myExportButtonPosition[0] = -this.myImportButtonPosition[0];


        // Pointer

        this.myPointerCollisionExtents = this.myBackBackgroundScale.pp_clone();
        this.myPointerCollisionExtents[2] = this.myCursorTargetCollisionThickness;
        this.myPointerCursorTargetPosition = this.myBackPanelPosition.pp_clone();
        this.myPointerCursorTargetPosition[2] = this._myColliderZOffset - 0.0001; // A little behind the button target to avoid hiding it
    }

    _setupRuntimeConfig() {
        this.myButtonHoverColor = vec4_create(150 / 255, 150 / 255, 150 / 255, 1);

        this.myScrollVariableDelay = 0.5;

        this._setupRuntimeConfigHook();
    }
}