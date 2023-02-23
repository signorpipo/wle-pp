PP.ConsoleVRWidgetSetup = class ConsoleVRWidgetSetup {

    constructor() {
        this._initializeBuildSetup();
        this._initializeRuntimeSetup();
    }

    _initializeBuildSetup() {
        //General
        this.myBackgroundColor = [46 / 255, 46 / 255, 46 / 255, 1];

        this.myCursorTargetCollisionCollider = 2; // box
        this.myCursorTargetCollisionGroup = 7; //keep this in sync with ConsoleVRSetup
        this.myCursorTargetCollisionThickness = 0.001;

        this.myDefaultTextColor = [255 / 255, 255 / 255, 255 / 255, 1];

        this.myTextAlignment = 2; // center
        this.myTextJustification = 2; // middle
        this.myTextColor = this.myDefaultTextColor;

        this.myMessageTypeColors = [];
        this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.LOG] = this.myDefaultTextColor;
        this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.ERROR] = [255 / 255, 40 / 255, 40 / 255, 1];
        this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.WARN] = [250 / 255, 220 / 255, 40 / 255, 1];
        this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.DEBUG] = [60 / 255, 200 / 255, 255 / 255, 1];

        //Messages
        this.myMessagesPanelPosition = PP.vec3_create(0, 0.075, 0);

        this.myMessagesBackgroundScale = PP.vec3_create(0.34, 0.15, 1);

        {
            let xPaddingPercentage = 0.03;
            let yPaddingPercentage = xPaddingPercentage * this.myMessagesBackgroundScale[0] / this.myMessagesBackgroundScale[1] * 0.8; //a bit less padding
            let xPosition = -this.myMessagesBackgroundScale[0] + this.myMessagesBackgroundScale[0] * xPaddingPercentage;
            let yPosition = this.myMessagesBackgroundScale[1] - this.myMessagesBackgroundScale[1] * yPaddingPercentage;
            this.myMessagesTextsPanelPosition = PP.vec3_create(xPosition, yPosition, 0.007);
        }
        this.myMessagesTextsPanelScale = PP.vec3_create(0.1, 0.1, 0.1);

        this.myMessagesTextStartString = ".\n"; // to avoid issue with text component padding
        this.myMessagesTextAlignment = 1; // left
        this.myMessagesTextJustification = 3; // top

        this.myMessagesTextPositions = [];
        this.myMessagesTextPositions[PP.ConsoleVRWidget.MessageType.LOG] = PP.vec3_create(0, 0, 0.00001);
        this.myMessagesTextPositions[PP.ConsoleVRWidget.MessageType.ERROR] = PP.vec3_create(0, 0, 0);
        this.myMessagesTextPositions[PP.ConsoleVRWidget.MessageType.WARN] = PP.vec3_create(0, 0, 0);
        this.myMessagesTextPositions[PP.ConsoleVRWidget.MessageType.DEBUG] = PP.vec3_create(0, 0, 0);

        this.myMessagesTextColors = [];
        this.myMessagesTextColors[PP.ConsoleVRWidget.MessageType.LOG] = this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.LOG];
        this.myMessagesTextColors[PP.ConsoleVRWidget.MessageType.ERROR] = this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.ERROR];
        this.myMessagesTextColors[PP.ConsoleVRWidget.MessageType.WARN] = this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.WARN];
        this.myMessagesTextColors[PP.ConsoleVRWidget.MessageType.DEBUG] = this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.DEBUG];

        //Buttons     
        this.myButtonsPanelPosition = PP.vec3_create(0, -0.11, 0.015);

        this.myButtonBackgroundScale = PP.vec3_create(0.04, 0.02, 1);

        this.myButtonTextPosition = PP.vec3_create(0, 0, 0.007);
        this.myButtonTextScale = PP.vec3_create(0.18, 0.18, 0.18);

        this.myButtonCursorTargetPosition = PP.vec3_create(0, 0, 0);
        this.myButtonCursorTargetPosition[2] = this.myButtonTextPosition[2];

        this.myButtonsCollisionCollider = this.myCursorTargetCollisionCollider;
        this.myButtonsCollisionGroup = this.myCursorTargetCollisionGroup;
        this.myButtonsCollisionExtents = this.myButtonBackgroundScale.slice(0);
        this.myButtonsCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myClearButtonTextLabel = "clear";
        this.myUpButtonTextLabel = "up";
        this.myDownButtonTextLabel = "down";

        this.myFilterButtonsTextColors = [];
        this.myFilterButtonsTextColors[PP.ConsoleVRWidget.MessageType.LOG] = this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.LOG];
        this.myFilterButtonsTextColors[PP.ConsoleVRWidget.MessageType.ERROR] = this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.ERROR];
        this.myFilterButtonsTextColors[PP.ConsoleVRWidget.MessageType.WARN] = this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.WARN];
        this.myFilterButtonsTextColors[PP.ConsoleVRWidget.MessageType.DEBUG] = this.myMessageTypeColors[PP.ConsoleVRWidget.MessageType.DEBUG];

        this.myFilterButtonsTextLabel = [];
        this.myFilterButtonsTextLabel[PP.ConsoleVRWidget.MessageType.LOG] = "log";
        this.myFilterButtonsTextLabel[PP.ConsoleVRWidget.MessageType.ERROR] = "error";
        this.myFilterButtonsTextLabel[PP.ConsoleVRWidget.MessageType.WARN] = "warn";
        this.myFilterButtonsTextLabel[PP.ConsoleVRWidget.MessageType.DEBUG] = "debug";

        //Buttons positioning
        {
            let numberOfButtons = 7;
            let buttonsHorizontalSpace = Math.max(0.68, this.myButtonBackgroundScale[0] * numberOfButtons);
            //2 at start, 3 between filters, 4 spaces between filter and clear and 4 spaces between clear and up/down, 1 space between up and down, 1 at end
            let numberOfSpacesBetweenButtons = 2 + 3 + 4 + 4 + 1 + 2;
            let spaceWidth = Math.max((buttonsHorizontalSpace - numberOfButtons * this.myButtonBackgroundScale[0] * 2) / numberOfSpacesBetweenButtons, 0);
            let halfButtonWidth = this.myButtonBackgroundScale[0];
            let initialPosition = - buttonsHorizontalSpace / 2;

            this.myFilterButtonsPositions = [];
            this.myFilterButtonsPositions[PP.ConsoleVRWidget.MessageType.LOG] = [initialPosition + spaceWidth * 2 + halfButtonWidth, 0, 0];
            this.myFilterButtonsPositions[PP.ConsoleVRWidget.MessageType.ERROR] = [this.myFilterButtonsPositions[PP.ConsoleVRWidget.MessageType.LOG][0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];
            this.myFilterButtonsPositions[PP.ConsoleVRWidget.MessageType.WARN] = [this.myFilterButtonsPositions[PP.ConsoleVRWidget.MessageType.ERROR][0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];
            this.myFilterButtonsPositions[PP.ConsoleVRWidget.MessageType.DEBUG] = [this.myFilterButtonsPositions[PP.ConsoleVRWidget.MessageType.WARN][0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];

            this.myClearButtonPosition = [this.myFilterButtonsPositions[PP.ConsoleVRWidget.MessageType.DEBUG][0] + halfButtonWidth + spaceWidth * 4 + halfButtonWidth, 0, 0];
            this.myUpButtonPosition = [this.myClearButtonPosition[0] + halfButtonWidth + spaceWidth * 4 + halfButtonWidth, 0, 0];
            this.myDownButtonPosition = [this.myUpButtonPosition[0] + halfButtonWidth + spaceWidth + halfButtonWidth, 0, 0];
        }

        //Notify Icon
        this.myNotifyIconBackgroundScale = PP.vec3_create(0.01, 0.01, 1);

        this.myNotifyIconPanelPositions = [];
        this.myNotifyIconPanelPositions[PP.ToolHandedness.NONE] = PP.vec3_create(0, 0, 0);
        this.myNotifyIconPanelPositions[PP.ToolHandedness.NONE][0] = -this.myMessagesBackgroundScale[0] + this.myNotifyIconBackgroundScale[0] + 0.01;
        this.myNotifyIconPanelPositions[PP.ToolHandedness.NONE][1] = -this.myMessagesBackgroundScale[1] + this.myNotifyIconBackgroundScale[1] + 0.01;
        this.myNotifyIconPanelPositions[PP.ToolHandedness.NONE][2] = this.myMessagesTextsPanelPosition[2] - 0.00001; //prevent glitches with text

        this.myNotifyIconPanelPositions[PP.ToolHandedness.LEFT] = this.myNotifyIconPanelPositions[PP.ToolHandedness.NONE];

        this.myNotifyIconPanelPositions[PP.ToolHandedness.RIGHT] = this.myNotifyIconPanelPositions[PP.ToolHandedness.NONE];

        this.myNotifyIconCursorTargetPosition = PP.vec3_create(0, 0, 0);
        this.myNotifyIconCursorTargetPosition[2] = this.myButtonsPanelPosition[2] + this.myButtonTextPosition[2] - this.myMessagesTextsPanelPosition[2]; // a little behind the button target to avoid hiding it

        this.myNotifyIconCollisionExtents = this.myNotifyIconBackgroundScale.slice(0);
        this.myNotifyIconCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myNotifyIconColor = [210 / 255, 210 / 255, 210 / 255, 1];

        //Pointer
        this.myPointerCollisionCollider = this.myCursorTargetCollisionCollider;
        this.myPointerCollisionGroup = this.myCursorTargetCollisionGroup;

        {
            let spaceBetweenMessagesAndButtons = Math.abs((this.myMessagesPanelPosition[1] - this.myMessagesBackgroundScale[1]) - (this.myButtonsPanelPosition[1] + this.myButtonBackgroundScale[1]));
            let pointerCollisionHalfHeight = this.myMessagesBackgroundScale[1] + this.myButtonBackgroundScale[1] + spaceBetweenMessagesAndButtons / 2;
            this.myPointerCollisionExtents = PP.vec3_create(this.myMessagesBackgroundScale[0], pointerCollisionHalfHeight, this.myCursorTargetCollisionThickness);
        }

        this.myPointerCursorTargetPosition = PP.vec3_create(0, 0, 0);
        this.myPointerCursorTargetPosition[1] = (this.myMessagesPanelPosition[1] + this.myMessagesBackgroundScale[1]) - this.myPointerCollisionExtents[1];
        this.myPointerCursorTargetPosition[2] = this.myButtonsPanelPosition[2] + this.myButtonTextPosition[2] - 0.0001; // a little behind the button target to avoid hiding it
    }

    _initializeRuntimeSetup() {
        this.myTabString = "     ";
        this.myAssertStartString = "Assertion failed:";

        this.myMaxCharactersPerLine = 100;
        this.myMaxLineSplits = 50; //prevent infinite splitting
        this.myMaxLines = 22;
        this.myMaxMessages = 2000;
        this.myMaxMessagesDeletePad = 2000; // to prevent deleting at every message, delay the delete after the limit is exceed by this value

        this.myLinesBetweenMessages = 1;

        this.myButtonHoverColor = [150 / 255, 150 / 255, 150 / 255, 1];
        this.myButtonDisabledTextColor = this.myBackgroundColor;
        this.myButtonDisabledBackgroundColor = [110 / 255, 110 / 255, 110 / 255, 1];

        this.myFilterButtonDisabledTextColor = this.myButtonDisabledTextColor;
        this.myFilterButtonDisabledBackgroundColor = this.myButtonDisabledBackgroundColor;

        this.myScrollDelay = 0.1;
        this.myScrollAmount = 1;
        this.myScrollThumbstickHandedness = PP.ToolHandedness.RIGHT;
        this.myScrollThumbstickDelay = 0.1;
        this.myScrollThumbstickMinThreshold = 0.2;
        this.myScrollThumbstickAmount = 3;

        this.myPulseDelay = 5;
        this.myPulseIntensity = 0.3;
        this.myPulseDuration = 0.085;

        this.myClearBrowserConsoleWhenClearPressed = true;

        this.myGamepadScrollOnlyOnHover = true;
    }
};