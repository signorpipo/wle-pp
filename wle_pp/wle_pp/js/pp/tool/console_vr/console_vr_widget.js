import { getLeftGamepad, getRightGamepad } from "../../input/cauldron/input_globals";
import { GamepadAxesID, GamepadButtonID } from "../../input/gamepad/gamepad_buttons";
import { getMainEngine } from "../../cauldron/wl/engine_globals";
import { ToolHandedness } from "../cauldron/tool_types";
import { WidgetFrame } from "../widget_frame/widget_frame";
import { getOriginalConsoleClear } from "./console_original_functions";
import { getConsoleVR } from "./console_vr_global";
import { ConsoleVRWidgetConsoleFunction, ConsoleVRWidgetMessageType, ConsoleVRWidgetPulseOnNewMessage, ConsoleVRWidgetSender } from "./console_vr_types";
import { ConsoleVRWidgetSetup } from "./console_vr_widget_setup";
import { ConsoleVRWidgetUI } from "./console_vr_widget_ui";

export class ConsoleVRWidgetAdditionalSetup {

    constructor() {
        this.myHandedness = ToolHandedness.NONE;
        this.myOverrideBrowserConsole = false;
        this.myShowOnStart = false;
        this.myShowVisibilityButton = false;
        this.myPulseOnNewMessage = ConsoleVRWidgetPulseOnNewMessage.NEVER;
        this.myPlaneMaterial = null;
        this.myTextMaterial = null;
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

        let text = this._myOriginalText.slice(0);
        text = countString.concat(text);
        this.myLines = text.split("\n");
    }
}

// Doesn't support
//  - Placeholder like %d and other similar kind of way to build strings
export class ConsoleVRWidget {

    constructor(engine = getMainEngine()) {
        this._myWidgetFrame = new WidgetFrame("C", 0, engine);
        this._myWidgetFrame.registerWidgetVisibleChangedEventListener(this, this._widgetVisibleChanged.bind(this));

        this._mySetup = new ConsoleVRWidgetSetup();
        this._myAdditionalSetup = null;

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

        this._myGamepadScrollActive = true;
        if (this._mySetup.myGamepadScrollOnlyOnHover) {
            this._myGamepadScrollActive = false;
        }

        this._myEngine = engine;
    }

    setVisible(visible) {
        this._myWidgetFrame.setVisible(visible);
    }

    isVisible() {
        return this._myWidgetFrame.isVisible();
    }

    start(parentObject, additionalSetup) {
        this._myLeftGamepad = getLeftGamepad(this._myEngine);
        this._myRightGamepad = getRightGamepad(this._myEngine);

        this._myAdditionalSetup = additionalSetup;

        this._myWidgetFrame.start(parentObject, additionalSetup);

        this._myUI.build(this._myWidgetFrame.getWidgetObject(), this._mySetup, additionalSetup);
        this._myUI.setVisible(this._myWidgetFrame.myIsWidgetVisible);
        this._setNotifyIconActive(false);

        this._addListeners();

        this._overrideConsolesFunctions();
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

        if (this._myAdditionalSetup.myOverrideBrowserConsole) {
            console.log = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.LOG, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.error = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.ERROR, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.warn = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.WARN, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.info = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.INFO, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.debug = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.DEBUG, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.assert = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.ASSERT, ConsoleVRWidgetSender.BROWSER_CONSOLE);
            console.clear = this._clearConsole.bind(this, true, ConsoleVRWidgetSender.BROWSER_CONSOLE);

            window.addEventListener("error", function (errorEvent) {
                if (errorEvent.error != null) {
                    this._consolePrint(ConsoleVRWidgetConsoleFunction.ERROR, ConsoleVRWidgetSender.WINDOW, "Uncaught", errorEvent.error.stack);
                } else {
                    this._consolePrint(ConsoleVRWidgetConsoleFunction.ERROR, ConsoleVRWidgetSender.WINDOW, "Uncaught", errorEvent.message);
                }
            }.bind(this));

            window.addEventListener("unhandledrejection", function (errorEvent) {
                this._consolePrint(ConsoleVRWidgetConsoleFunction.ERROR, ConsoleVRWidgetSender.WINDOW, "Uncaught (in promise)", errorEvent.reason);
            }.bind(this));
        }

        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.LOG] = getConsoleVR(this._myEngine).log;
        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.ERROR] = getConsoleVR(this._myEngine).error;
        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.WARN] = getConsoleVR(this._myEngine).warn;
        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.INFO] = getConsoleVR(this._myEngine).info;
        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.DEBUG] = getConsoleVR(this._myEngine).debug;
        this._myOldConsoleVR[ConsoleVRWidgetConsoleFunction.ASSERT] = getConsoleVR(this._myEngine).assert;
        this._myOldConsoleVRClear = getConsoleVR(this._myEngine).clear;

        getConsoleVR(this._myEngine).log = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.LOG, ConsoleVRWidgetSender.CONSOLE_VR);
        getConsoleVR(this._myEngine).error = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.ERROR, ConsoleVRWidgetSender.CONSOLE_VR);
        getConsoleVR(this._myEngine).warn = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.WARN, ConsoleVRWidgetSender.CONSOLE_VR);
        getConsoleVR(this._myEngine).info = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.INFO, ConsoleVRWidgetSender.CONSOLE_VR);
        getConsoleVR(this._myEngine).debug = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.DEBUG, ConsoleVRWidgetSender.CONSOLE_VR);
        getConsoleVR(this._myEngine).assert = this._consolePrint.bind(this, ConsoleVRWidgetConsoleFunction.ASSERT, ConsoleVRWidgetSender.CONSOLE_VR);
        getConsoleVR(this._myEngine).clear = this._clearConsole.bind(this, true, ConsoleVRWidgetSender.CONSOLE_VR);
    }

    update(dt) {
        this._myWidgetFrame.update(dt);

        if (this._myWidgetFrame.myIsWidgetVisible) {
            this._updateScroll(dt);
        }

        this._updateGamepadsExtraActions(dt);
    }

    // Text section

    _updateText(messageType) {
        let consoleText = "";

        if (!this._myTypeFilters[messageType]) {
            let linesCount = 0;
            let i = this._myMessages.length - 1;

            let scrollLinesToSkip = Math.round(this._myScrollOffset);

            while (i >= 0 && linesCount < this._mySetup.myMaxLines) {
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
                        additionalEmptyLines = this._mySetup.myLinesBetweenMessages;
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
                    let emptyLinesToSkip = this._mySetup.myLinesBetweenMessages - Math.max(this._mySetup.myLinesBetweenMessages - linesToSkip, 0);
                    let emptyLinesToShow = this._mySetup.myLinesBetweenMessages - emptyLinesToSkip;
                    if (linesCount + emptyLinesToShow > this._mySetup.myMaxLines) {
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
                if (linesCount + linesToShow > this._mySetup.myMaxLines) {
                    linesToShow = this._mySetup.myMaxLines - linesCount;
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

        consoleText = this._mySetup.myMessagesTextStartString.concat(consoleText);

        this._myUI.myMessagesTextComponents[messageType].text = consoleText;
    }

    _consolePrint(consoleFunction, sender, ...args) {
        if (consoleFunction != ConsoleVRWidgetConsoleFunction.ASSERT || (args.length > 0 && !args[0])) {
            let message = this._argsToMessage(consoleFunction, ...args);
            this._addMessage(message);

            if (this._myMessages.length >= this._mySetup.myMaxMessages + this._mySetup.myMaxMessagesDeletePad) {
                this._myMessages = this._myMessages.slice(this._myMessages.length - this._mySetup.myMaxMessages);
                this._clampScrollOffset();
            }

            this._updateAllTexts();

            this._pulseGamepad();
        }

        switch (sender) {
            case ConsoleVRWidgetSender.BROWSER_CONSOLE:
                this._myOldBrowserConsole[consoleFunction].apply(console, args);
                break;
            case ConsoleVRWidgetSender.CONSOLE_VR:
                this._myOldConsoleVR[consoleFunction].apply(getConsoleVR(this._myEngine), args);
                break;
            default:
                this._myOldBrowserConsole[consoleFunction].apply(console, args);
                break;
        }
    }

    _argsToMessage(consoleFunction, ...args) {
        if (consoleFunction == ConsoleVRWidgetConsoleFunction.ASSERT) {
            args = args.slice(1);
            args.splice(0, 0, this._mySetup.myAssertStartString);
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
        if (typeof item === "object") {
            let stringifiedItem = null;
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

            return stringifiedItem;
        }

        return item;
    }

    _splitLongLines(messageText) {
        let linesToSplit = messageText.split("\n");
        let lines = [];
        for (let i = 0; i < linesToSplit.length; i++) {
            let lineToSplit = linesToSplit[i];

            if (lineToSplit.length > this._mySetup.myMaxCharactersPerLine) {
                let spacesAtStart = this._getSpacesAtStart(lineToSplit);
                let spaceToAdd = this._mySetup.myTabString.concat(spacesAtStart);
                let lineSplits = 0;

                while (lineToSplit.length > this._mySetup.myMaxCharactersPerLine && lineSplits < this._mySetup.myMaxLineSplits) {
                    let firstSub = lineToSplit.substr(0, this._mySetup.myMaxCharactersPerLine - 1);
                    let secondSub = lineToSplit.substr(this._mySetup.myMaxCharactersPerLine - 1);
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
            this._myScrollOffset += message.myLines.length + this._mySetup.myLinesBetweenMessages;
        }
    }

    _updateAllTexts() {
        if (this._myWidgetFrame.myIsWidgetVisible) {
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
            while (this._myScrollTimer > this._mySetup.myScrollDelay) {
                this._myScrollTimer -= this._mySetup.myScrollDelay;
                this._myScrollOffset += this._mySetup.myScrollAmount;
            }
        } else if (this._myScrollDown) {
            this._myScrollTimer += dt;
            while (this._myScrollTimer > this._mySetup.myScrollDelay) {
                this._myScrollTimer -= this._mySetup.myScrollDelay;
                this._myScrollOffset -= this._mySetup.myScrollAmount;
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
        return Math.max(this._getLinesCount() - this._mySetup.myMaxLines, 0);
    }

    _getLinesCount() {
        let linesCount = 0;
        for (let message of this._myMessages) {
            if (!this._myTypeFilters[message.myType]) {
                linesCount += message.myLines.length + this._mySetup.myLinesBetweenMessages;
            }
        }
        linesCount -= this._mySetup.myLinesBetweenMessages; // Empty line is added only between messages
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

            cursorTarget.addTripleClickFunction(this._resetFilters.bind(this, ConsoleVRWidgetMessageType[key]));
            cursorTarget.addDoubleClickFunction(this._filterAllButOne.bind(this, ConsoleVRWidgetMessageType[key], textMaterial));
            cursorTarget.addClickFunction(this._toggleFilter.bind(this, ConsoleVRWidgetMessageType[key], textMaterial));
            cursorTarget.addHoverFunction(this._filterHover.bind(this, ConsoleVRWidgetMessageType[key], backgroundMaterial));
            cursorTarget.addUnHoverFunction(this._filterUnHover.bind(this, ConsoleVRWidgetMessageType[key], backgroundMaterial));
        }

        {
            let cursorTarget = ui.myClearButtonCursorTargetComponent;
            let backgroundMaterial = ui.myClearButtonBackgroundComponent.material;

            cursorTarget.addClickFunction(this._clearConsole.bind(this, false, null));
            cursorTarget.addHoverFunction(this._genericHover.bind(this, backgroundMaterial));
            cursorTarget.addUnHoverFunction(this._genericUnHover.bind(this, backgroundMaterial));
        }

        {
            let cursorTarget = ui.myUpButtonCursorTargetComponent;
            let backgroundMaterial = ui.myUpButtonBackgroundComponent.material;

            cursorTarget.addDoubleClickFunction(this._instantScrollUp.bind(this, true));
            cursorTarget.addDownFunction(this._setScrollUp.bind(this, true));
            cursorTarget.addUpFunction(this._setScrollUp.bind(this, false));
            cursorTarget.addUnHoverFunction(this._setScrollUp.bind(this, false));
            cursorTarget.addHoverFunction(this._genericHover.bind(this, backgroundMaterial));
            cursorTarget.addUnHoverFunction(this._genericUnHover.bind(this, backgroundMaterial));
        }

        {
            let cursorTarget = ui.myDownButtonCursorTargetComponent;
            let backgroundMaterial = ui.myDownButtonBackgroundComponent.material;

            cursorTarget.addDoubleClickFunction(this._instantScrollDown.bind(this));
            cursorTarget.addDownFunction(this._setScrollDown.bind(this, true));
            cursorTarget.addUpFunction(this._setScrollDown.bind(this, false));
            cursorTarget.addUnHoverFunction(this._setScrollDown.bind(this, false));
            cursorTarget.addHoverFunction(this._genericHover.bind(this, backgroundMaterial));
            cursorTarget.addUnHoverFunction(this._genericUnHover.bind(this, backgroundMaterial));
        }

        {
            let cursorTarget = ui.myNotifyIconCursorTargetComponent;
            let backgroundMaterial = ui.myNotifyIconBackgroundComponent.material;

            cursorTarget.addClickFunction(this._instantScrollDown.bind(this));
            cursorTarget.addHoverFunction(this._genericHover.bind(this, backgroundMaterial));
            cursorTarget.addUnHoverFunction(this._notifyIconUnHover.bind(this));
        }

        ui.myPointerCursorTargetComponent.addHoverFunction(this._setGamepadScrollActive.bind(this, true));
        ui.myPointerCursorTargetComponent.addUnHoverFunction(this._setGamepadScrollActive.bind(this, false));
    }

    _resetFilters(messageType) {
        if (this._myWidgetFrame.myIsWidgetVisible) {
            for (let key in ConsoleVRWidgetMessageType) {
                let backgroundMaterial = this._myUI.myFilterButtonsBackgroundComponents[ConsoleVRWidgetMessageType[key]].material;
                let filterTextMaterial = this._myUI.myFilterButtonsTextComponents[ConsoleVRWidgetMessageType[key]].material;

                this._myTypeFilters[ConsoleVRWidgetMessageType[key]] = false;
                filterTextMaterial.color = this._mySetup.myMessageTypeColors[ConsoleVRWidgetMessageType[key]];
                if (ConsoleVRWidgetMessageType[key] != messageType) {
                    backgroundMaterial.color = this._mySetup.myBackgroundColor;
                }
            }

            this._clampScrollOffset();
            this._updateAllTexts();
        }
    }

    _filterAllButOne(messageType) {
        if (this._myWidgetFrame.myIsWidgetVisible) {
            for (let key in ConsoleVRWidgetMessageType) {
                let backgroundMaterial = this._myUI.myFilterButtonsBackgroundComponents[ConsoleVRWidgetMessageType[key]].material;
                let filterTextMaterial = this._myUI.myFilterButtonsTextComponents[ConsoleVRWidgetMessageType[key]].material;
                if (ConsoleVRWidgetMessageType[key] != messageType) {
                    this._myTypeFilters[ConsoleVRWidgetMessageType[key]] = true;
                    backgroundMaterial.color = this._mySetup.myFilterButtonDisabledBackgroundColor;
                    filterTextMaterial.color = this._mySetup.myFilterButtonDisabledTextColor;
                } else {
                    this._myTypeFilters[ConsoleVRWidgetMessageType[key]] = false;
                    filterTextMaterial.color = this._mySetup.myMessageTypeColors[messageType];
                }
            }

            this._clampScrollOffset();
            this._updateAllTexts();
        }
    }

    _toggleFilter(messageType, textMaterial) {
        if (this._myWidgetFrame.myIsWidgetVisible) {

            this._myTypeFilters[messageType] = !this._myTypeFilters[messageType];
            if (this._myTypeFilters[messageType]) {
                textMaterial.color = this._mySetup.myFilterButtonDisabledTextColor;
            } else {
                textMaterial.color = this._mySetup.myMessageTypeColors[messageType];
            }

            this._clampScrollOffset();
            this._updateAllTexts();
        }
    }

    _clearConsole(codeDrivenClear = false, sender = null) {
        if (this._myWidgetFrame.myIsWidgetVisible || codeDrivenClear) {
            this._myMessages = [];
            this._clampScrollOffset();
            this._updateAllTexts();

            if (codeDrivenClear) {
                switch (sender) {
                    case ConsoleVRWidgetSender.BROWSER_CONSOLE:
                        this._myOldBrowserConsoleClear.apply(console);
                        break;
                    case ConsoleVRWidgetSender.CONSOLE_VR:
                        this._myOldConsoleVRClear.apply(getConsoleVR(this._myEngine));
                        break;
                    default:
                        break;
                }
            } else if (this._mySetup.myClearBrowserConsoleWhenClearPressed) {
                getOriginalConsoleClear()();
            }
        }
    }

    _setScrollUp(value) {
        if (this._myWidgetFrame.myIsWidgetVisible || !value) {
            if (value) {
                this._myScrollTimer = 0;
            }

            this._myScrollUp = value;
        }
    }

    _setScrollDown(value) {
        if (this._myWidgetFrame.myIsWidgetVisible || !value) {
            if (value) {
                this._myScrollTimer = 0;
            }

            this._myScrollDown = value;
        }
    }

    _instantScrollUp() {
        if (this._myWidgetFrame.myIsWidgetVisible) {
            this._myScrollOffset = this._getMaxScrollOffset();
            this._updateAllTexts();
        }
    }

    _instantScrollDown() {
        if (this._myWidgetFrame.myIsWidgetVisible) {
            this._myScrollOffset = 0;
            this._setNotifyIconActive(false);
            this._updateAllTexts();
        }
    }

    _setNotifyIconActive(active) {
        this._myUI.myNotifyIconPanel.pp_setActive(active && this._myWidgetFrame.myIsWidgetVisible);
    }

    _notifyIconUnHover() {
        let material = this._myUI.myNotifyIconBackgroundComponent.material;
        material.color = this._mySetup.myNotifyIconColor;
    }

    _filterHover(messageType, material) {
        this._genericHover(material);
    }

    _filterUnHover(messageType, material) {
        if (this._myTypeFilters[messageType]) {
            material.color = this._mySetup.myFilterButtonDisabledBackgroundColor;
        } else {
            material.color = this._mySetup.myBackgroundColor;
        }
    }

    _genericHover(material) {
        material.color = this._mySetup.myButtonHoverColor;
    }

    _genericUnHover(material) {
        material.color = this._mySetup.myBackgroundColor;
    }

    // Gamepad section

    _updateGamepadsExtraActions(dt) {
        if (this._myLeftGamepad && this._myRightGamepad) {
            if ((this._myLeftGamepad.getButtonInfo(GamepadButtonID.THUMBSTICK).isPressStart() && this._myRightGamepad.getButtonInfo(GamepadButtonID.THUMBSTICK).myIsPressed) ||
                (this._myRightGamepad.getButtonInfo(GamepadButtonID.THUMBSTICK).isPressStart() && this._myLeftGamepad.getButtonInfo(GamepadButtonID.THUMBSTICK).myIsPressed)) {
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
        if (this._myWidgetFrame.myIsWidgetVisible && this._myGamepadScrollActive) {
            let axes = [0, 0];
            if (this._mySetup.myScrollThumbstickHandedness == ToolHandedness.LEFT) {
                axes = this._myLeftGamepad.getAxesInfo(GamepadAxesID.THUMBSTICK).myAxes;
            } else if (this._mySetup.myScrollThumbstickHandedness == ToolHandedness.RIGHT) {
                axes = this._myRightGamepad.getAxesInfo(GamepadAxesID.THUMBSTICK).myAxes;
            }

            if (Math.abs(axes[1]) > this._mySetup.myScrollThumbstickMinThreshold) {
                this._myScrollThumbstickTimer += dt;

                while (this._myScrollThumbstickTimer > this._mySetup.myScrollThumbstickDelay) {
                    this._myScrollThumbstickTimer -= this._mySetup.myScrollThumbstickDelay;

                    let normalizedScrollAmount = (Math.abs(axes[1]) - this._mySetup.myScrollThumbstickMinThreshold) / (1 - this._mySetup.myScrollThumbstickMinThreshold);
                    this._myScrollOffset += Math.sign(axes[1]) * normalizedScrollAmount * this._mySetup.myScrollThumbstickAmount;
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
            let pulseType = this._myAdditionalSetup.myPulseOnNewMessage;
            let pulseEnabled = pulseType == ConsoleVRWidgetPulseOnNewMessage.ALWAYS || (!this._myWidgetFrame.myIsWidgetVisible && pulseType == ConsoleVRWidgetPulseOnNewMessage.WHEN_HIDDEN);
            if (pulseEnabled && this._myPulseTimer == 0) {
                if (this._myAdditionalSetup.myHandedness == ToolHandedness.RIGHT) {
                    this._myRightGamepad.pulse(this._mySetup.myPulseIntensity, this._mySetup.myPulseDuration);
                } else {
                    this._myLeftGamepad.pulse(this._mySetup.myPulseIntensity, this._mySetup.myPulseDuration);
                }
                this._myPulseTimer = this._mySetup.myPulseDelay;
            }
        }
    }

    _isSimpleArray(array) {
        if (this._isSpecialSimpleArray(array)) {
            return true;
        } else if (Array.isArray(array)) {
            let isBuiltIn = true;
            for (let element of array) {
                if (element instanceof Object) {
                    isBuiltIn = false;
                    break;
                }
            }

            return isBuiltIn;
        }

        return false;
    }

    _isSpecialSimpleArray(item) {
        let arrayPrototypesToExtend = [
            Array.prototype, Uint8ClampedArray.prototype, Uint8Array.prototype, Uint16Array.prototype, Uint32Array.prototype, Int8Array.prototype,
            Int16Array.prototype, Int32Array.prototype, Float32Array.prototype, Float64Array.prototype];
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

    _setGamepadScrollActive(active) {
        this._myGamepadScrollActive = active;

        if (!this._mySetup.myGamepadScrollOnlyOnHover) {
            this._myGamepadScrollActive = true;
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
}