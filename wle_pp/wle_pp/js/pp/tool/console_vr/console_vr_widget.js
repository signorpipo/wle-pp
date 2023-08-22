import { GamepadAxesID, GamepadButtonID } from "../../input/gamepad/gamepad_buttons";
import { Globals } from "../../pp/globals";
import { ToolHandedness } from "../cauldron/tool_types";
import { WidgetFrame, WidgetParams } from "../widget_frame/widget_frame";
import { ConsoleOriginalFunctions } from "./console_original_functions";
import { ConsoleVRWidgetConsoleFunction, ConsoleVRWidgetMessageType, ConsoleVRWidgetPulseOnNewMessage, ConsoleVRWidgetSender } from "./console_vr_types";
import { ConsoleVRWidgetConfig } from "./console_vr_widget_config";
import { ConsoleVRWidgetUI } from "./console_vr_widget_ui";

export class ConsoleVRWidgetParams extends WidgetParams {

    constructor() {
        super();

        this.myOverrideBrowserConsole = false;
        this.myShowOnStart = false;
        this.myShowVisibilityButton = false;
        this.myPulseOnNewMessage = ConsoleVRWidgetPulseOnNewMessage.NEVER;

        this.myResetBrowserConsoleOriginalFunctionsOnDestroy = true;
    }
}

export class ConsoleVRWidgetMessage {

    constructor(messageType, messageLines) {
        this.myType = messageType;
        this.myLines = messageLines;

        this._myOriginalText = messageLines.join("\n");

        this._myMessagesCount = 1;
    }

    hasSameInfo(message) {
        return this._myOriginalText == message._myOriginalText && this.myType == message.myType;
    }

    increaseCount() {
        this._myMessagesCount += 1;

        let countString = (("(x").concat(this._myMessagesCount)).concat(") ");

        let text = this._myOriginalText;
        text = countString.concat(text);
        this.myLines = text.split("\n");
    }
}

// Does Not Support:
//  - Placeholder like %d and other similar kind of way to build strings
//
// Known Issues:
//  - Since the actual call to the browser console is done by the widget, u will not be able to click
//    on the browser console source code link (usually on the right of the logged message) to go to the line where 
//    the console function has been called, since it will always go to the line where 
//    the console VR widget forwards the call to the browser console
export class ConsoleVRWidget {

    constructor(engine = Globals.getMainEngine()) {
        this._myWidgetFrame = new WidgetFrame("C", 0, engine);
        this._myWidgetFrame.registerWidgetVisibleChangedEventListener(this, this._widgetVisibleChanged.bind(this));

        this._myConfig = new ConsoleVRWidgetConfig();
        this._myParams = null;

        this._myUI = new ConsoleVRWidgetUI(engine);

        this._myMessages = [];

        this._myOldBrowserConsole = [];
        this._myOldConsoleVR = [];

        this._myTypeFilters = [];
        for (let key in ConsoleVRWidgetMessageType) {
            this._myTypeFilters[ConsoleVRWidgetMessageType[key]] = false;
        }

        this._myScrollUp = false;
        this._myScrollDown = false;
        this._myScrollOffset = 0;
        this._myScrollTimer = 0;
        this._myScrollThumbstickTimer = 0;

        this._myPulseTimer = 0;

        this._myGamepadScrollEnabled = true;
        if (this._myConfig.myGamepadScrollOnlyOnHover) {
            this._myGamepadScrollEnabled = false;
        }

        this._myErrorEventListener = null;
        this._myUnhandledRejectionEventListener = null;

        this._myConsolePrintAddMessageEnabled = true;
        this._myConsolePrintUpdateTextEnabled = true;
        this._myConsolePrintAddMessageEnabledReset = false;
        this._myConsolePrintUpdateTextEnabledReset = false;
        this._myTextDirty = false;

        this._myEngine = engine;

        this._myDestroyed = false;
    }

    setVisible(visible) {
        this._myWidgetFrame.setVisible(visible);
    }

    isVisible() {
        return this._myWidgetFrame.isVisible();
    }

    start(parentObject, params) {
        this._myLeftGamepad = Globals.getLeftGamepad(this._myEngine);
        this._myRightGamepad = Globals.getRightGamepad(this._myEngine);

        this._myParams = params;

        this._myWidgetFrame.start(parentObject, params);

        this._myUI.build(this._myWidgetFrame.getWidgetObject(), this._myConfig, params);
        this._myUI.setVisible(this._myWidgetFrame.isVisible());
        this._setNotifyIconActive(false);

        this._addListeners();

        this._overrideConsolesFunctions();
    }

    update(dt) {
        this._myWidgetFrame.update(dt);

        if (this._myWidgetFrame.isVisible()) {
            if (this._myConsolePrintAddMessageEnabledReset) {
                this._myConsolePrintAddMessageEnabledReset = false;
                this._myConsolePrintAddMessageEnabled = true;
            }

            if (this._myConsolePrintUpdateTextEnabledReset) {
                this._myConsolePrintUpdateTextEnabledReset = false;
                this._myConsolePrintUpdateTextEnabled = true;
            }

            if (this._myTextDirty) {
                this._myTextDirty = false;
                this._updateAllTexts();
            }

            this._updateScroll(dt);
        }

        this._updateGamepadsExtraActions(dt);
    }

    // This must be done only when all the setup is complete, to avoid issues with other part of the code calling the console and then triggering the console vr while not ready yet
    _overrideConsolesFunctions() {
        this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.LOG] = console.log;
        this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.ERROR] = console.error;
        this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.WARN] = console.warn;
        this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.INFO] = console.info;
        this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.DEBUG] = console.debug;
        this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.ASSERT] = console.assert;
        this._myOldBrowserConsoleClear = console.clear;

        if (this._myParams.myOverrideBrowserConsole) {
            console.log = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.LOG, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.error = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.ERROR, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.warn = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.WARN, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.info = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.INFO, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.debug = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.DEBUG, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.assert = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.ASSERT, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.clear = this._clearConsole.bind(this, true, ConsoleVRWidgetSender.BROWSER_CONSOLE);

            this._myErrorEventListener = function (errorEvent) {
                if (errorEvent.error != null) {
                    this._consolePrint(ConsoleVRWidgetConsoleFunction.ERROR, ConsoleVRWidgetSender.WINDOW, "Uncaught", errorEvent.error.stack);
                } else {
                    this._consolePrint(ConsoleVRWidgetConsoleFunction.ERROR, ConsoleVRWidgetSender.WINDOW, "Uncaught", errorEvent.message);
                }
            }.bind(this);

            this._myUnhandledRejectionEventListener = function (errorEvent) {
                this._consolePrint(ConsoleVRWidgetConsoleFunction.ERROR, ConsoleVRWidgetSender.WINDOW, "Uncaught (in promise)", errorEvent.reason);
            }.bind(this);

            Globals.getWindow(this._myEngine).addEventListener("error", this._myErrorEventListener);
            Globals.getWindow(this._myEngine).addEventListener("unhandledrejection", this._myUnhandledRejectionEventListener);
        }

        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.LOG] = Globals.getConsoleVR(this._myEngine).log;
        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.ERROR] = Globals.getConsoleVR(this._myEngine).error;
        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.WARN] = Globals.getConsoleVR(this._myEngine).warn;
        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.INFO] = Globals.getConsoleVR(this._myEngine).info;
        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.DEBUG] = Globals.getConsoleVR(this._myEngine).debug;
        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.ASSERT] = Globals.getConsoleVR(this._myEngine).assert;
        this._myOldConsoleVRClear = Globals.getConsoleVR(this._myEngine).clear;

        Globals.getConsoleVR(this._myEngine).log = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.LOG, ConsoleVRWidgetSender.CONSOLE_VR);
        Globals.getConsoleVR(this._myEngine).error = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.ERROR, ConsoleVRWidgetSender.CONSOLE_VR);
        Globals.getConsoleVR(this._myEngine).warn = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.WARN, ConsoleVRWidgetSender.CONSOLE_VR);
        Globals.getConsoleVR(this._myEngine).info = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.INFO, ConsoleVRWidgetSender.CONSOLE_VR);
        Globals.getConsoleVR(this._myEngine).debug = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.DEBUG, ConsoleVRWidgetSender.CONSOLE_VR);
        Globals.getConsoleVR(this._myEngine).assert = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.ASSERT, ConsoleVRWidgetSender.CONSOLE_VR);
        Globals.getConsoleVR(this._myEngine).clear = this._clearConsole.bind(this, true, ConsoleVRWidgetSender.CONSOLE_VR);
    }

    // Text section

    _updateText(messageType) {
        let consoleText = "";

        if (!this._myTypeFilters[messageType]) {
            let linesCount = 0;
            let i = this._myMessages.length - 1;

            let scrollLinesToSkip = Math.round(this._myScrollOffset);

            while (i >= 0 && linesCount < this._myConfig.myMaxLines) {
                let message = this._myMessages[i];

                // Skip filtered messages
                if (this._myTypeFilters[message.myType]) {
                    i -= 1;
                    continue;
                }

                let messageLines = message.myLines.length;

                // Compute line to skip due to scroll offset
                let linesToSkip = 0;
                if (scrollLinesToSkip > 0) {
                    let additionalEmptyLines = 0;
                    if (i != this._myMessages.length - 1) {
                        additionalEmptyLines = this._myConfig.myLinesBetweenMessages;
                    }

                    if (scrollLinesToSkip >= messageLines + additionalEmptyLines) { // + empty lines between messages
                        scrollLinesToSkip -= messageLines + additionalEmptyLines;
                        linesToSkip = messageLines + additionalEmptyLines;
                    } else {
                        linesToSkip = scrollLinesToSkip;
                        scrollLinesToSkip = 0;
                    }
                }

                // Add empty lines between messages
                if (i != this._myMessages.length - 1) {
                    let emptyLinesToSkip = this._myConfig.myLinesBetweenMessages - Math.max(this._myConfig.myLinesBetweenMessages - linesToSkip, 0);
                    let emptyLinesToShow = this._myConfig.myLinesBetweenMessages - emptyLinesToSkip;
                    if (linesCount + emptyLinesToShow > this._myConfig.myMaxLines) {
                        emptyLinesToShow = this._myMaxLines - linesCount;
                    }

                    for (let j = 0; j < emptyLinesToShow; j++) {
                        consoleText = ("\n").concat(consoleText);
                    }

                    linesCount += emptyLinesToShow;
                    linesToSkip -= emptyLinesToSkip;
                }

                // Computing the number of message lines to show
                let linesToShow = messageLines - linesToSkip;
                if (linesCount + linesToShow > this._myConfig.myMaxLines) {
                    linesToShow = this._myConfig.myMaxLines - linesCount;
                }

                if (linesToShow > 0) {
                    if (message.myType == messageType) {
                        // If the message is the same type of this message text component, add the message lines

                        let linesToPrint = message.myLines.slice(messageLines - linesToShow - linesToSkip, messageLines - linesToSkip);
                        let text = linesToPrint.join("\n");
                        consoleText = (text.concat("\n")).concat(consoleText);

                        linesCount += linesToShow;
                    } else {
                        // Otherwise add empty lines, so that the text component with the correct type will have space to show this message

                        for (let j = 0; j < linesToShow; j++) {
                            consoleText = ("\n").concat(consoleText);
                        }

                        linesCount += linesToShow;
                    }
                }

                i -= 1;
            }
        }

        consoleText = this._myConfig.myMessagesTextStartString.concat(consoleText);

        try {
            this._myConsolePrintUpdateTextEnabled = false;
            this._myUI.myMessagesTextComponents[messageType].text = consoleText;
            this._myConsolePrintUpdateTextEnabled = true;
        } catch (error) {
            this._myConsolePrintUpdateTextEnabledReset = true;
            throw error;
        }
    }

    _consolePrint(consoleFunction, sender, ...args) {
        if (this._myConsolePrintAddMessageEnabled && (consoleFunction != ConsoleVRWidgetConsoleFunction.ASSERT || (args.length > 0 && !args[0]))) {
            try {
                let message = this._argsToMessage(consoleFunction, ...args);
                this._addMessage(message);

                if (this._myMessages.length >= this._myConfig.myMaxMessages + this._myConfig.myMaxMessagesDeletePad) {
                    this._myMessages = this._myMessages.slice(this._myMessages.length - this._myConfig.myMaxMessages);
                    this._clampScrollOffset();
                }
            } catch (error) {
                this._myConsolePrintAddMessageEnabled = false;
                this._myConsolePrintAddMessageEnabledReset = true;

                this._myTextDirty = true;

                try {
                    let errorMessage = "An error occurred while trying to add a new message to the Console VR Widget";
                    let message = new ConsoleVRWidgetMessage(ConsoleVRWidgetMessageType.ERROR, [errorMessage]);
                    this._myMessages.push(message);
                    ConsoleOriginalFunctions.error(this._myEngine, errorMessage);
                } catch (anotherError) {
                    // ignored
                }

                throw error;
            }

            if (this._myConsolePrintUpdateTextEnabled) {
                this._updateAllTexts();
                this._pulseGamepad();
            } else {
                this._myTextDirty = true;
            }
        }

        switch (sender) {
            case ConsoleVRWidgetSender.BROWSER_CONSOLE:
                this._myOldBrowserConsole[consoleFunction].apply(console, args);
                break;
            case ConsoleVRWidgetSender.CONSOLE_VR:
                this._myOldConsoleVR[consoleFunction].apply(Globals.getConsoleVR(this._myEngine), args);
                break;
            default:
                this._myOldBrowserConsole[consoleFunction].apply(console, args);
                break;
        }
    }

    _argsToMessage(consoleFunction, ...args) {
        if (consoleFunction == ConsoleVRWidgetConsoleFunction.ASSERT) {
            args = args.slice(1);
            args.splice(0, 0, this._myConfig.myAssertStartString);
        }

        let messageType = this._consoleFunctionToMessageType(consoleFunction);

        let formattedText = this._formatArgs(...args);

        let lines = this._splitLongLines(formattedText);

        if (messageType == ConsoleVRWidgetMessageType.INFO) {
            messageType = ConsoleVRWidgetMessageType.LOG;
        } else if (messageType == ConsoleVRWidgetMessageType.EXCEPTION || messageType == ConsoleVRWidgetMessageType.ASSERT) {
            messageType = ConsoleVRWidgetMessageType.ERROR;
        }


        let message = new ConsoleVRWidgetMessage(messageType, lines);

        return message;
    }

    _consoleFunctionToMessageType(consoleFunction) {
        let messageType = ConsoleVRWidgetMessageType.LOG;

        if (consoleFunction < ConsoleVRWidgetConsoleFunction.INFO) {
            messageType = consoleFunction;
        } else if (consoleFunction == ConsoleVRWidgetConsoleFunction.INFO) {
            messageType = ConsoleVRWidgetMessageType.LOG;
        } else {
            messageType = ConsoleVRWidgetMessageType.ERROR;
        }

        return messageType;
    }

    // Here the formatting using placeholder like %d could be implemented in the future
    _formatArgs(...args) {
        let stringifiedArgs = [];
        for (let i = 0; i < args.length; i++) {
            if (args[i] === undefined) {
                stringifiedArgs.push("undefined");
            } else {
                stringifiedArgs.push(this._stringifyItem(args[i]));
            }
        }

        let formattedString = stringifiedArgs.join(" ");

        return formattedString;
    }

    _stringifyItem(item) {
        let stringifiedItem = null;

        if (item instanceof Error) {
            stringifiedItem = item.stack;
        } else if (typeof item === "object") {
            let linesBetweenItems = 2;

            try {
                stringifiedItem = JSON.stringify(item, this._jsonReplacer.bind(this), linesBetweenItems);
            } catch (error) {
                let cache = new WeakSet();

                stringifiedItem = JSON.stringify(item, function (key, value) {
                    if (typeof value === "object" && value !== null) {
                        if (cache.has(value)) {
                            return "<stringify error: object already stringified>"; // Try to avoid circular reference, a repeated object will be caught in this check too sadly
                        }
                        cache.add(value);
                    }

                    return this._jsonReplacer(key, value);
                }.bind(this), linesBetweenItems);
            }

            stringifiedItem = stringifiedItem.replaceAll("\"[", "[");
            stringifiedItem = stringifiedItem.replaceAll("'[", "[");
            stringifiedItem = stringifiedItem.replaceAll("]\"", "]");
            stringifiedItem = stringifiedItem.replaceAll("]'", "]");
        } else {
            stringifiedItem = item;
        }

        return stringifiedItem;
    }

    _splitLongLines(messageText) {
        let linesToSplit = messageText.split("\n");
        let lines = [];
        for (let i = 0; i < linesToSplit.length; i++) {
            let lineToSplit = linesToSplit[i];

            if (lineToSplit.length > this._myConfig.myMaxCharactersPerLine) {
                let spacesAtStart = this._getSpacesAtStart(lineToSplit);
                let spaceToAdd = this._myConfig.myTabString.concat(spacesAtStart);
                let lineSplits = 0;

                while (lineToSplit.length > this._myConfig.myMaxCharactersPerLine && lineSplits < this._myConfig.myMaxLineSplits) {
                    let firstSub = lineToSplit.substr(0, this._myConfig.myMaxCharactersPerLine - 1);
                    let secondSub = lineToSplit.substr(this._myConfig.myMaxCharactersPerLine - 1);
                    secondSub = spaceToAdd.concat(secondSub);

                    lines.push(firstSub);

                    lineToSplit = secondSub;
                    lineSplits++;
                }
                lines.push(lineToSplit);
            } else {
                lines.push(lineToSplit);
            }
        }

        return lines;
    }

    _getSpacesAtStart(text) {
        let spaces = "";
        let i = 0;

        while (i < text.length && text[i] == " ") {
            spaces = spaces.concat(" ");
            i++;
        }

        return spaces;
    }

    _addMessage(message) {
        let hasSameInfoAsPrev = false;
        if (this._myMessages.length > 0) {
            let lastMessage = this._myMessages[this._myMessages.length - 1];
            if (lastMessage.hasSameInfo(message)) {
                lastMessage.increaseCount();
                hasSameInfoAsPrev = true;
            }
        }

        if (!hasSameInfoAsPrev) {
            this._myMessages.push(message);
        }

        this._adjustScrollOffsetAfterMessageAdded(message, hasSameInfoAsPrev);
        this._updateNotifyIcon(message);
    }

    // If you have scrolled, new messages does not move the scroll position
    _adjustScrollOffsetAfterMessageAdded(message, hasSameInfoAsPrev) {
        if (!hasSameInfoAsPrev && !(this._myTypeFilters[message.myType]) && this._myScrollOffset > 0) {
            this._myScrollOffset += message.myLines.length + this._myConfig.myLinesBetweenMessages;
        }
    }

    _updateAllTexts() {
        if (this._myWidgetFrame.isVisible()) {
            for (let key in ConsoleVRWidgetMessageType) {
                this._updateText(ConsoleVRWidgetMessageType[key]);
            }
        }
    }

    _updateNotifyIcon(message) {
        if (!(this._myTypeFilters[message.myType]) && this._myScrollOffset > 0) {
            this._setNotifyIconActive(true);
        }
    }

    _updateScroll(dt) {
        if (this._myScrollUp) {
            this._myScrollTimer += dt;
            while (this._myScrollTimer > this._myConfig.myScrollDelay) {
                this._myScrollTimer -= this._myConfig.myScrollDelay;
                this._myScrollOffset += this._myConfig.myScrollAmount;
            }
        } else if (this._myScrollDown) {
            this._myScrollTimer += dt;
            while (this._myScrollTimer > this._myConfig.myScrollDelay) {
                this._myScrollTimer -= this._myConfig.myScrollDelay;
                this._myScrollOffset -= this._myConfig.myScrollAmount;
            }
        }

        this._clampScrollOffset();

        if (this._myScrollUp || this._myScrollDown) {
            this._updateAllTexts();
        }

        if (this._myScrollOffset == 0) {
            this._setNotifyIconActive(false);
        }
    }

    _clampScrollOffset() {
        let maxScroll = this._getMaxScrollOffset();
        this._myScrollOffset = Math.pp_clamp(this._myScrollOffset, 0, maxScroll);
    }

    _getMaxScrollOffset() {
        return Math.max(this._getLinesCount() - this._myConfig.myMaxLines, 0);
    }

    _getLinesCount() {
        let linesCount = 0;
        for (let message of this._myMessages) {
            if (!this._myTypeFilters[message.myType]) {
                linesCount += message.myLines.length + this._myConfig.myLinesBetweenMessages;
            }
        }
        linesCount -= this._myConfig.myLinesBetweenMessages; // Empty line is added only between messages
        linesCount = Math.max(linesCount, 0);

        return linesCount;
    }

    // Listener section

    _addListeners() {
        let ui = this._myUI;

        for (let key in ConsoleVRWidgetMessageType) {
            let cursorTarget = ui.myFilterButtonsCursorTargetComponents[ConsoleVRWidgetMessageType[key]];
            let backgroundMaterial = ui.myFilterButtonsBackgroundComponents[ConsoleVRWidgetMessageType[key]].material;
            let textMaterial = ui.myFilterButtonsTextComponents[ConsoleVRWidgetMessageType[key]].material;

            cursorTarget.onSingleClick.add(this._toggleFilter.bind(this, ConsoleVRWidgetMessageType[key], textMaterial));
            cursorTarget.onDoubleClick.add(this._filterAllButOne.bind(this, ConsoleVRWidgetMessageType[key], textMaterial));
            cursorTarget.onTripleClick.add(this._resetFilters.bind(this, ConsoleVRWidgetMessageType[key]));
            cursorTarget.onHover.add(this._filterHover.bind(this, ConsoleVRWidgetMessageType[key], backgroundMaterial));
            cursorTarget.onUnhover.add(this._filterUnhover.bind(this, ConsoleVRWidgetMessageType[key], backgroundMaterial));
        }

        {
            let cursorTarget = ui.myClearButtonCursorTargetComponent;
            let backgroundMaterial = ui.myClearButtonBackgroundComponent.material;

            cursorTarget.onClick.add(this._clearConsole.bind(this, false, null));
            cursorTarget.onHover.add(this._genericHover.bind(this, backgroundMaterial));
            cursorTarget.onUnhover.add(this._genericUnhover.bind(this, backgroundMaterial));
        }

        {
            let cursorTarget = ui.myUpButtonCursorTargetComponent;
            let backgroundMaterial = ui.myUpButtonBackgroundComponent.material;

            cursorTarget.onDoubleClick.add(this._instantScrollUp.bind(this, true));
            cursorTarget.onDown.add(this._setScrollUp.bind(this, true));
            cursorTarget.onDownOnHover.add(this._setScrollUp.bind(this, true));
            cursorTarget.onUp.add(this._setScrollUp.bind(this, false));
            cursorTarget.onUnhover.add(this._setScrollUp.bind(this, false));
            cursorTarget.onHover.add(this._genericHover.bind(this, backgroundMaterial));
            cursorTarget.onUnhover.add(this._genericUnhover.bind(this, backgroundMaterial));
        }

        {
            let cursorTarget = ui.myDownButtonCursorTargetComponent;
            let backgroundMaterial = ui.myDownButtonBackgroundComponent.material;

            cursorTarget.onDoubleClick.add(this._instantScrollDown.bind(this));
            cursorTarget.onDown.add(this._setScrollDown.bind(this, true));
            cursorTarget.onDownOnHover.add(this._setScrollDown.bind(this, true));
            cursorTarget.onUp.add(this._setScrollDown.bind(this, false));
            cursorTarget.onUnhover.add(this._setScrollDown.bind(this, false));
            cursorTarget.onHover.add(this._genericHover.bind(this, backgroundMaterial));
            cursorTarget.onUnhover.add(this._genericUnhover.bind(this, backgroundMaterial));
        }

        {
            let cursorTarget = ui.myNotifyIconCursorTargetComponent;
            let backgroundMaterial = ui.myNotifyIconBackgroundComponent.material;

            cursorTarget.onClick.add(this._instantScrollDown.bind(this));
            cursorTarget.onHover.add(this._genericHover.bind(this, backgroundMaterial));
            cursorTarget.onUnhover.add(this._notifyIconUnhover.bind(this));
        }

        ui.myPointerCursorTargetComponent.onHover.add(this._setGamepadScrollEnabled.bind(this, true));
        ui.myPointerCursorTargetComponent.onUnhover.add(this._setGamepadScrollEnabled.bind(this, false));
    }

    _resetFilters(messageType) {
        if (this._myWidgetFrame.isVisible()) {
            for (let key in ConsoleVRWidgetMessageType) {
                let backgroundMaterial = this._myUI.myFilterButtonsBackgroundComponents[ConsoleVRWidgetMessageType[key]].material;
                let filterTextMaterial = this._myUI.myFilterButtonsTextComponents[ConsoleVRWidgetMessageType[key]].material;

                this._myTypeFilters[ConsoleVRWidgetMessageType[key]] = false;
                filterTextMaterial.color = this._myConfig.myMessageTypeColors[ConsoleVRWidgetMessageType[key]];
                if (ConsoleVRWidgetMessageType[key] != messageType) {
                    backgroundMaterial.color = this._myConfig.myBackgroundColor;
                }
            }

            this._clampScrollOffset();
            this._updateAllTexts();
        }
    }

    _filterAllButOne(messageType) {
        if (this._myWidgetFrame.isVisible()) {
            for (let key in ConsoleVRWidgetMessageType) {
                let backgroundMaterial = this._myUI.myFilterButtonsBackgroundComponents[ConsoleVRWidgetMessageType[key]].material;
                let filterTextMaterial = this._myUI.myFilterButtonsTextComponents[ConsoleVRWidgetMessageType[key]].material;
                if (ConsoleVRWidgetMessageType[key] != messageType) {
                    this._myTypeFilters[ConsoleVRWidgetMessageType[key]] = true;
                    backgroundMaterial.color = this._myConfig.myFilterButtonDisabledBackgroundColor;
                    filterTextMaterial.color = this._myConfig.myFilterButtonDisabledTextColor;
                } else {
                    this._myTypeFilters[ConsoleVRWidgetMessageType[key]] = false;
                    filterTextMaterial.color = this._myConfig.myMessageTypeColors[messageType];
                }
            }

            this._clampScrollOffset();
            this._updateAllTexts();
        }
    }

    _toggleFilter(messageType, textMaterial) {
        if (this._myWidgetFrame.isVisible()) {

            this._myTypeFilters[messageType] = !this._myTypeFilters[messageType];
            if (this._myTypeFilters[messageType]) {
                textMaterial.color = this._myConfig.myFilterButtonDisabledTextColor;
            } else {
                textMaterial.color = this._myConfig.myMessageTypeColors[messageType];
            }

            this._clampScrollOffset();
            this._updateAllTexts();
        }
    }

    _clearConsole(codeDrivenClear = false, sender = null) {
        if (this._myWidgetFrame.isVisible() || codeDrivenClear) {
            this._myMessages = [];
            this._clampScrollOffset();
            this._updateAllTexts();

            if (codeDrivenClear) {
                switch (sender) {
                    case ConsoleVRWidgetSender.BROWSER_CONSOLE:
                        this._myOldBrowserConsoleClear.apply(console);
                        break;
                    case ConsoleVRWidgetSender.CONSOLE_VR:
                        this._myOldConsoleVRClear.apply(Globals.getConsoleVR(this._myEngine));
                        break;
                    default:
                        break;
                }
            } else if (this._myConfig.myClearBrowserConsoleWhenClearPressed) {
                ConsoleOriginalFunctions.clear(this._myEngine);
            }
        }
    }

    _setScrollUp(value) {
        if (this._myWidgetFrame.isVisible() || !value) {
            if (value) {
                this._myScrollTimer = 0;
            }

            this._myScrollUp = value;
        }
    }

    _setScrollDown(value) {
        if (this._myWidgetFrame.isVisible() || !value) {
            if (value) {
                this._myScrollTimer = 0;
            }

            this._myScrollDown = value;
        }
    }

    _instantScrollUp() {
        if (this._myWidgetFrame.isVisible()) {
            this._myScrollOffset = this._getMaxScrollOffset();
            this._updateAllTexts();
        }
    }

    _instantScrollDown() {
        if (this._myWidgetFrame.isVisible()) {
            this._myScrollOffset = 0;
            this._setNotifyIconActive(false);
            this._updateAllTexts();
        }
    }

    _setNotifyIconActive(active) {
        this._myUI.myNotifyIconPanel.pp_setActive(active && this._myWidgetFrame.isVisible());
    }

    _notifyIconUnhover() {
        let material = this._myUI.myNotifyIconBackgroundComponent.material;
        material.color = this._myConfig.myNotifyIconColor;
    }

    _filterHover(messageType, material) {
        this._genericHover(material);
    }

    _filterUnhover(messageType, material) {
        if (this._myTypeFilters[messageType]) {
            material.color = this._myConfig.myFilterButtonDisabledBackgroundColor;
        } else {
            material.color = this._myConfig.myBackgroundColor;
        }
    }

    _genericHover(material) {
        material.color = this._myConfig.myButtonHoverColor;
    }

    _genericUnhover(material) {
        material.color = this._myConfig.myBackgroundColor;
    }

    // Gamepad section

    _updateGamepadsExtraActions(dt) {
        if (this._myLeftGamepad && this._myRightGamepad) {
            if ((this._myLeftGamepad.getButtonInfo(GamepadButtonID.THUMBSTICK).isPressStart() && this._myRightGamepad.getButtonInfo(GamepadButtonID.THUMBSTICK).isPressed()) ||
                (this._myRightGamepad.getButtonInfo(GamepadButtonID.THUMBSTICK).isPressStart() && this._myLeftGamepad.getButtonInfo(GamepadButtonID.THUMBSTICK).isPressed())) {
                this._toggleVisibility();
            }

            this._myPulseTimer = Math.max(this._myPulseTimer - dt, 0);

            this._updateScrollWithThumbstick(dt);
        }
    }

    _toggleVisibility() {
        this._myWidgetFrame.toggleVisibility();
    }

    _widgetVisibleChanged(visible) {
        this._myUI.setVisible(visible);
        if (visible) {
            this._updateAllTexts();
        }
    }

    _updateScrollWithThumbstick(dt) {
        if (this._myWidgetFrame.isVisible() && this._myGamepadScrollEnabled) {
            let axes = [0, 0];
            if (this._myConfig.myScrollThumbstickHandedness == ToolHandedness.LEFT) {
                axes = this._myLeftGamepad.getAxesInfo(GamepadAxesID.THUMBSTICK).myAxes;
            } else if (this._myConfig.myScrollThumbstickHandedness == ToolHandedness.RIGHT) {
                axes = this._myRightGamepad.getAxesInfo(GamepadAxesID.THUMBSTICK).myAxes;
            }

            if (Math.abs(axes[1]) > this._myConfig.myScrollThumbstickMinThreshold) {
                this._myScrollThumbstickTimer += dt;

                while (this._myScrollThumbstickTimer > this._myConfig.myScrollThumbstickDelay) {
                    this._myScrollThumbstickTimer -= this._myConfig.myScrollThumbstickDelay;

                    let normalizedScrollAmount = (Math.abs(axes[1]) - this._myConfig.myScrollThumbstickMinThreshold) / (1 - this._myConfig.myScrollThumbstickMinThreshold);
                    this._myScrollOffset += Math.sign(axes[1]) * normalizedScrollAmount * this._myConfig.myScrollThumbstickAmount;
                }

                this._clampScrollOffset();
                this._updateAllTexts();
            } else {
                this._myScrollThumbstickTimer = 0;
            }
        }
    }

    _pulseGamepad() {
        if (this._myLeftGamepad && this._myRightGamepad) {
            let pulseType = this._myParams.myPulseOnNewMessage;
            let pulseEnabled = pulseType == ConsoleVRWidgetPulseOnNewMessage.ALWAYS || (!this._myWidgetFrame.isVisible() && pulseType == ConsoleVRWidgetPulseOnNewMessage.WHEN_HIDDEN);
            if (pulseEnabled && this._myPulseTimer == 0) {
                if (this._myParams.myHandedness == ToolHandedness.RIGHT) {
                    this._myRightGamepad.pulse(this._myConfig.myPulseIntensity, this._myConfig.myPulseDuration);
                } else {
                    this._myLeftGamepad.pulse(this._myConfig.myPulseIntensity, this._myConfig.myPulseDuration);
                }
                this._myPulseTimer = this._myConfig.myPulseDelay;
            }
        }
    }

    _isSimpleArray(array) {
        if (this._isSpecialSimpleArray(array)) {
            return true;
        } else if (Array.isArray(array)) {
            let builtInArray = true;
            for (let element of array) {
                if (element instanceof Object) {
                    builtInArray = false;
                    break;
                }
            }

            return builtInArray;
        }

        return false;
    }

    _isSpecialSimpleArray(item) {
        return item && item.constructor &&
            (
                item.constructor.name == "Uint8ClampedArray" ||
                item.constructor.name == "Uint8Array" ||
                item.constructor.name == "Uint16Array" ||
                item.constructor.name == "Uint32Array" ||
                item.constructor.name == "Int8Array" ||
                item.constructor.name == "Int16Array" ||
                item.constructor.name == "Int32Array" ||
                item.constructor.name == "Float32Array" ||
                item.constructor.name == "Float64Array"
            );
    }

    _setGamepadScrollEnabled(enabled) {
        this._myGamepadScrollEnabled = enabled;

        if (!this._myConfig.myGamepadScrollOnlyOnHover) {
            this._myGamepadScrollEnabled = true;
        }
    }

    _jsonReplacer(key, value) {
        if (value instanceof Map) {
            return Array.from(value.entries());
        } else if (this._isSimpleArray(value)) {
            let array = value;
            if (this._isSpecialSimpleArray(array)) {
                let arrayCopy = []; // Special arrays like Float32Array do not print like Array
                for (let i = 0; i < array.length; i++) {
                    arrayCopy[i] = array[i];
                }

                array = arrayCopy;
            }

            let stringifiedArray = JSON.stringify(array);
            stringifiedArray = stringifiedArray.split(",").join(", ");
            return stringifiedArray;
        } else {
            return value;
        }
    }

    destroy() {
        this._myDestroyed = true;

        Globals.getWindow(this._myEngine).removeEventListener("error", this._myErrorEventListener);
        Globals.getWindow(this._myEngine).removeEventListener("unhandledrejection", this._myUnhandledRejectionEventListener);

        this._myUI.destroy();
        this._myWidgetFrame.destroy();

        if (this._myParams.myResetBrowserConsoleOriginalFunctionsOnDestroy) {
            console.log = ConsoleOriginalFunctions.getLog(this._myEngine);
            console.error = ConsoleOriginalFunctions.getError(this._myEngine);
            console.warn = ConsoleOriginalFunctions.getWarn(this._myEngine);
            console.info = ConsoleOriginalFunctions.getInfo(this._myEngine);
            console.debug = ConsoleOriginalFunctions.getDebug(this._myEngine);
            console.assert = ConsoleOriginalFunctions.getAssert(this._myEngine);
            console.clear = ConsoleOriginalFunctions.getClear(this._myEngine);
        } else {
            console.log = this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.LOG];
            console.error = this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.ERROR];
            console.warn = this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.WARN];
            console.info = this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.INFO];
            console.debug = this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.DEBUG];
            console.assert = this._myOldBrowserConsole[ConsoleVRWidgetConsoleFunction.ASSERT];
            console.clear = this._myOldBrowserConsoleClear;
        }
    }

    isDestroyed() {
        return this._myDestroyed;
    }
}