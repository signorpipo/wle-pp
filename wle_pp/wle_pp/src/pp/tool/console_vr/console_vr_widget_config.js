import { Alignment, Collider, Justification } from "@wonderlandengine/api";
import { vec3_create, vec4_create } from "../../plugin/js/extensions/array/vec_create_extension.js";
import { ToolHandedness } from "../cauldron/tool_types.js";
import { ConsoleVRWidgetMessageType } from "./console_vr_types.js";

export class ConsoleVRWidgetConfig {

    constructor() {
        this._setupBuildConfig();
        this._setupRuntimeConfig();
    }

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

        this.myMessageTypeColors = [];
        this.myMessageTypeColors[ConsoleVRWidgetMessageType.LOG] = this.myDefaultTextColor;
        this.myMessageTypeColors[ConsoleVRWidgetMessageType.ERROR] = vec4_create(255 / 255, 40 / 255, 40 / 255, 1);
        this.myMessageTypeColors[ConsoleVRWidgetMessageType.WARN] = vec4_create(250 / 255, 220 / 255, 40 / 255, 1);
        this.myMessageTypeColors[ConsoleVRWidgetMessageType.DEBUG] = vec4_create(60 / 255, 200 / 255, 255 / 255, 1);

        // Messages
        this.myMessagesPanelPosition = vec3_create(0, 0.075, 0);

        this.myMessagesBackgroundScale = vec3_create(0.34, 0.15, 1);

        {
            let xPaddingPercentage = 0.03;
            let yPaddingPercentage = xPaddingPercentage * this.myMessagesBackgroundScale[0] / this.myMessagesBackgroundScale[1] * 0.8; // A bit less padding
            let xPosition = -this.myMessagesBackgroundScale[0] + this.myMessagesBackgroundScale[0] * xPaddingPercentage;
            let yPosition = this.myMessagesBackgroundScale[1] - this.myMessagesBackgroundScale[1] * yPaddingPercentage;
            this.myMessagesTextsPanelPosition = vec3_create(xPosition, yPosition, 0.007);
        }
        this.myMessagesTextsPanelScale = vec3_create(0.1, 0.1, 0.1);

        this.myMessagesTextStartString = ".\n"; // To avoid issue with text component padding
        this.myMessagesTextAlignment = Alignment.Left;
        this.myMessagesTextJustification = Justification.Top;

        this.myMessagesTextPositions = [];
        this.myMessagesTextPositions[ConsoleVRWidgetMessageType.LOG] = vec3_create(0, 0, 0.0002);
        this.myMessagesTextPositions[ConsoleVRWidgetMessageType.ERROR] = vec3_create(0, 0, 0);
        this.myMessagesTextPositions[ConsoleVRWidgetMessageType.WARN] = vec3_create(0, 0, 0);
        this.myMessagesTextPositions[ConsoleVRWidgetMessageType.DEBUG] = vec3_create(0, 0, 0);

        this.myMessagesTextColors = [];
        this.myMessagesTextColors[ConsoleVRWidgetMessageType.LOG] = this.myMessageTypeColors[ConsoleVRWidgetMessageType.LOG];
        this.myMessagesTextColors[ConsoleVRWidgetMessageType.ERROR] = this.myMessageTypeColors[ConsoleVRWidgetMessageType.ERROR];
        this.myMessagesTextColors[ConsoleVRWidgetMessageType.WARN] = this.myMessageTypeColors[ConsoleVRWidgetMessageType.WARN];
        this.myMessagesTextColors[ConsoleVRWidgetMessageType.DEBUG] = this.myMessageTypeColors[ConsoleVRWidgetMessageType.DEBUG];

        // Buttons     
        this.myButtonsPanelPosition = vec3_create(0, -0.11, 0.015);

        this.myButtonBackgroundScale = vec3_create(0.04, 0.02, 1);

        this.myButtonTextPosition = vec3_create(0, 0, 0.007);
        this.myButtonTextScale = vec3_create(0.18, 0.18, 0.18);

        this.myButtonCursorTargetPosition = vec3_create(0, 0, 0);
        this.myButtonCursorTargetPosition[2] = this.myButtonTextPosition[2];

        this.myButtonsCollisionCollider = this.myCursorTargetCollisionCollider;
        this.myButtonsCollisionGroup = this.myCursorTargetCollisionGroup;
        this.myButtonsCollisionExtents = this.myButtonBackgroundScale.pp_clone();
        this.myButtonsCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myClearButtonTextLabel = "clear";
        this.myUpButtonTextLabel = "up";
        this.myDownButtonTextLabel = "down";

        this.myFilterButtonsTextColors = [];
        this.myFilterButtonsTextColors[ConsoleVRWidgetMessageType.LOG] = this.myMessageTypeColors[ConsoleVRWidgetMessageType.LOG];
        this.myFilterButtonsTextColors[ConsoleVRWidgetMessageType.ERROR] = this.myMessageTypeColors[ConsoleVRWidgetMessageType.ERROR];
        this.myFilterButtonsTextColors[ConsoleVRWidgetMessageType.WARN] = this.myMessageTypeColors[ConsoleVRWidgetMessageType.WARN];
        this.myFilterButtonsTextColors[ConsoleVRWidgetMessageType.DEBUG] = this.myMessageTypeColors[ConsoleVRWidgetMessageType.DEBUG];

        this.myFilterButtonsTextLabel = [];
        this.myFilterButtonsTextLabel[ConsoleVRWidgetMessageType.LOG] = "log";
        this.myFilterButtonsTextLabel[ConsoleVRWidgetMessageType.ERROR] = "error";
        this.myFilterButtonsTextLabel[ConsoleVRWidgetMessageType.WARN] = "warn";
        this.myFilterButtonsTextLabel[ConsoleVRWidgetMessageType.DEBUG] = "debug";

        // Buttons positioning
        {
            let numberOfButtons = 7;
            let buttonsHorizontalSpace = Math.max(0.68, this.myButtonBackgroundScale[0] * numberOfButtons);
            // 2 at start, 3 between filters, 4 spaces between filter and clear and 4 spaces between clear and up/down, 1 space between up and down, 1 at end
            let numberOfSpacesBetweenButtons = 2 + 3 + 4 + 4 + 1 + 2;
            let spaceWidth = Math.max((buttonsHorizontalSpace - numberOfButtons * this.myButtonBackgroundScale[0] * 2) / numberOfSpacesBetweenButtons, 0);
            let halfButtonWidth = this.myButtonBackgroundScale[0];
            let initialPosition = - buttonsHorizontalSpace / 2;

            this.myFilterButtonsPositions = [];
            this.myFilterButtonsPositions[ConsoleVRWidgetMessageType.LOG] = [initialPosition + spaceWidth * 2 + halfButtonWidth, 0, 0];
            this.myFilterButtonsPositions[ConsoleVRWidgetMessageType.ERROR] = [this.myFilterButtonsPositions[ConsoleVRWidgetMessageType.LOG][0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];
            this.myFilterButtonsPositions[ConsoleVRWidgetMessageType.WARN] = [this.myFilterButtonsPositions[ConsoleVRWidgetMessageType.ERROR][0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];
            this.myFilterButtonsPositions[ConsoleVRWidgetMessageType.DEBUG] = [this.myFilterButtonsPositions[ConsoleVRWidgetMessageType.WARN][0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];

            this.myClearButtonPosition = [this.myFilterButtonsPositions[ConsoleVRWidgetMessageType.DEBUG][0] + halfButtonWidth + spaceWidth * 4 + halfButtonWidth, 0, 0];
            this.myUpButtonPosition = [this.myClearButtonPosition[0] + halfButtonWidth + spaceWidth * 4 + halfButtonWidth, 0, 0];
            this.myDownButtonPosition = [this.myUpButtonPosition[0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];
        }

        // Notify Icon
        this.myNotifyIconBackgroundScale = vec3_create(0.01, 0.01, 1);

        this.myNotifyIconPanelPositions = [];
        this.myNotifyIconPanelPositions[ToolHandedness.NONE] = vec3_create(0, 0, 0);
        this.myNotifyIconPanelPositions[ToolHandedness.NONE][0] = -this.myMessagesBackgroundScale[0] + this.myNotifyIconBackgroundScale[0] + 0.01;
        this.myNotifyIconPanelPositions[ToolHandedness.NONE][1] = -this.myMessagesBackgroundScale[1] + this.myNotifyIconBackgroundScale[1] + 0.01;
        this.myNotifyIconPanelPositions[ToolHandedness.NONE][2] = this.myMessagesTextsPanelPosition[2] - 0.00001; // Prevent glitches with text

        this.myNotifyIconPanelPositions[ToolHandedness.LEFT] = this.myNotifyIconPanelPositions[ToolHandedness.NONE];

        this.myNotifyIconPanelPositions[ToolHandedness.RIGHT] = this.myNotifyIconPanelPositions[ToolHandedness.NONE];

        this.myNotifyIconCursorTargetPosition = vec3_create(0, 0, 0);
        this.myNotifyIconCursorTargetPosition[2] = this.myButtonsPanelPosition[2] + this.myButtonTextPosition[2] - this.myMessagesTextsPanelPosition[2]; // A little behind the button target to avoid hiding it

        this.myNotifyIconCollisionExtents = this.myNotifyIconBackgroundScale.pp_clone();
        this.myNotifyIconCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myNotifyIconColor = vec4_create(210 / 255, 210 / 255, 210 / 255, 1);

        // Pointer
        this.myPointerCollisionCollider = this.myCursorTargetCollisionCollider;
        this.myPointerCollisionGroup = this.myCursorTargetCollisionGroup;

        {
            let spaceBetweenMessagesAndButtons = Math.abs((this.myMessagesPanelPosition[1] - this.myMessagesBackgroundScale[1]) - (this.myButtonsPanelPosition[1] + this.myButtonBackgroundScale[1]));
            let pointerCollisionHalfHeight = this.myMessagesBackgroundScale[1] + this.myButtonBackgroundScale[1] + spaceBetweenMessagesAndButtons / 2;
            this.myPointerCollisionExtents = vec3_create(this.myMessagesBackgroundScale[0], pointerCollisionHalfHeight, this.myCursorTargetCollisionThickness);
        }

        this.myPointerCursorTargetPosition = vec3_create(0, 0, 0);
        this.myPointerCursorTargetPosition[1] = (this.myMessagesPanelPosition[1] + this.myMessagesBackgroundScale[1]) - this.myPointerCollisionExtents[1];
        this.myPointerCursorTargetPosition[2] = this.myButtonsPanelPosition[2] + this.myButtonTextPosition[2] - 0.0002; // A little behind the button target to avoid hiding it
    }

    _setupRuntimeConfig() {
        this.myTabString = "     ";
        this.myAssertStartString = "Assertion failed:";

        this.myMaxCharactersPerLine = 100;
        this.myMaxLineSplits = 500; // Prevent infinite splitting
        this.myMaxLines = 22;
        this.myMaxMessages = 2000;
        this.myMaxMessagesDeletePad = 2000; // To prevent deleting at every message, delay the delete after the limit is exceed by this value

        this.myLinesBetweenMessages = 1;

        this.myButtonHoverColor = vec4_create(150 / 255, 150 / 255, 150 / 255, 1);
        this.myButtonDisabledTextColor = this.myBackgroundColor;
        this.myButtonDisabledBackgroundColor = vec4_create(110 / 255, 110 / 255, 110 / 255, 1);

        this.myFilterButtonDisabledTextColor = this.myButtonDisabledTextColor;
        this.myFilterButtonDisabledBackgroundColor = this.myButtonDisabledBackgroundColor;

        this.myScrollDelay = 0.1;
        this.myScrollAmount = 1;
        this.myScrollThumbstickHandedness = ToolHandedness.RIGHT;
        this.myScrollThumbstickDelay = 0.1;
        this.myScrollThumbstickMinThreshold = 0.2;
        this.myScrollThumbstickAmount = 3;

        this.myPulseDelay = 5;
        this.myPulseIntensity = 0.3;
        this.myPulseDuration = 0.085;

        this.myClearBrowserConsoleWhenClearPressed = false;

        this.myGamepadScrollOnlyOnHover = true;
    }
}