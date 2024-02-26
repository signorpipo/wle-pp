import { GamepadButtonID } from "../gamepad_buttons.js";

let _mySimultaneousPressMaxDelay = 0.15;
let _mySimultaneousTouchMaxDelay = 0.15;

export function setSimultaneousPressMaxDelay(simultaneousPressMaxDelay) {
    _mySimultaneousPressMaxDelay = simultaneousPressMaxDelay;
}

export function setSimultaneousTouchMaxDelay(simultaneousTouchMaxDelay) {
    _mySimultaneousTouchMaxDelay = simultaneousTouchMaxDelay;
}

export function getSimultaneousPressMaxDelay() {
    return _mySimultaneousPressMaxDelay;
}

export function getSimultaneousTouchMaxDelay() {
    return _mySimultaneousTouchMaxDelay;
}


// gamepadButtonIDsList is a sequence of a gamepads and a list of buttonIDs like this ([gamepad1, squeeze, top, select], [gamepad2, bottom, squeeze, select], ...)
// If the first parameter is a number it's used as multiplePressCount
// If the buttonIDs list is empty for a given gamepad, it means that every button will be included
export function isAnyButtonPressStart(...gamepadButtonIDsList) {
    let multiplePressCount = null;
    let realGamepadButtonIDsList = gamepadButtonIDsList;
    if (!isNaN(gamepadButtonIDsList[0])) {
        multiplePressCount = gamepadButtonIDsList[0];
        realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
    }

    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        if (gamepadButtonIDs.length == 1) {
            for (let key in GamepadButtonID) {
                gamepadButtonIDs.push(GamepadButtonID[key]);
            }
        }
    }

    let atLeastOneButtonPressStart = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (button.isPressStart(multiplePressCount)) {
                atLeastOneButtonPressStart = true;
                break;
            }
        }

        if (atLeastOneButtonPressStart) {
            break;
        }
    }

    return atLeastOneButtonPressStart;
}

// gamepadButtonIDsList is a sequence of a gamepads and a list of buttonIDs like this ([gamepad1, squeeze, top, select], [gamepad2, bottom, squeeze, select], ...)
// If the first parameter is a number it's used as multiplePressCount
// If the buttonIDs list is empty for a given gamepad, it means that every button will be included
export function areButtonsPressStart(...gamepadButtonIDsList) {
    let multiplePressCount = null;
    let realGamepadButtonIDsList = gamepadButtonIDsList;
    if (!isNaN(gamepadButtonIDsList[0])) {
        multiplePressCount = gamepadButtonIDsList[0];
        realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
    }

    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        if (gamepadButtonIDs.length == 1) {
            for (let key in GamepadButtonID) {
                gamepadButtonIDs.push(GamepadButtonID[key]);
            }
        }
    }

    let areButtonPressedRecently = true;
    let atLeastOneButtonPressStart = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (!(button.myPressed && (multiplePressCount == null || button.myMultiplePressStartCount == multiplePressCount) && button.myTimePressed < _mySimultaneousPressMaxDelay)) {
                areButtonPressedRecently = false;
                break;
            }

            if (button.isPressStart(multiplePressCount)) {
                atLeastOneButtonPressStart = true;
            }
        }

        if (!areButtonPressedRecently) {
            break;
        }
    }

    return areButtonPressedRecently && atLeastOneButtonPressStart;
}

export function isAnyButtonPressEnd(...gamepadButtonIDsList) {
    let multiplePressCount = null;
    let realGamepadButtonIDsList = gamepadButtonIDsList;
    if (!isNaN(gamepadButtonIDsList[0])) {
        multiplePressCount = gamepadButtonIDsList[0];
        realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
    }

    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        if (gamepadButtonIDs.length == 1) {
            for (let key in GamepadButtonID) {
                gamepadButtonIDs.push(GamepadButtonID[key]);
            }
        }
    }

    let atLeastOneButtonPressEnd = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (button.isPressEnd(multiplePressCount)) {
                atLeastOneButtonPressEnd = true;
                break;
            }
        }

        if (atLeastOneButtonPressEnd) {
            break;
        }
    }

    return atLeastOneButtonPressEnd;
}

export function areButtonsPressEnd(...gamepadButtonIDsList) {
    let multiplePressCount = null;
    let realGamepadButtonIDsList = gamepadButtonIDsList;
    if (!isNaN(gamepadButtonIDsList[0])) {
        multiplePressCount = gamepadButtonIDsList[0];
        realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
    }

    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        if (gamepadButtonIDs.length == 1) {
            for (let key in GamepadButtonID) {
                gamepadButtonIDs.push(GamepadButtonID[key]);
            }
        }
    }

    let areButtonNotPressedRecently = true;
    let atLeastOneButtonPressEnd = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (!(!button.myPressed && (multiplePressCount == null || button.myMultiplePressEndCount == multiplePressCount) && button.myTimeNotPressed < _mySimultaneousPressMaxDelay)) {
                areButtonNotPressedRecently = false;
                break;
            }

            if (button.isPressEnd(multiplePressCount)) {
                atLeastOneButtonPressEnd = true;
            }
        }

        if (!areButtonNotPressedRecently) {
            break;
        }
    }

    return areButtonNotPressedRecently && atLeastOneButtonPressEnd;
}

export function isAnyButtonTouchStart(...gamepadButtonIDsList) {
    let multiplePressCount = null;
    let realGamepadButtonIDsList = gamepadButtonIDsList;
    if (!isNaN(gamepadButtonIDsList[0])) {
        multiplePressCount = gamepadButtonIDsList[0];
        realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
    }

    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        if (gamepadButtonIDs.length == 1) {
            for (let key in GamepadButtonID) {
                gamepadButtonIDs.push(GamepadButtonID[key]);
            }
        }
    }

    let atLeastOneButtonTouchStart = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (button.isTouchStart(multiplePressCount)) {
                atLeastOneButtonTouchStart = true;
                break;
            }
        }

        if (atLeastOneButtonTouchStart) {
            break;
        }
    }

    return atLeastOneButtonTouchStart;
}

export function areButtonsTouchStart(...gamepadButtonIDsList) {
    let multipleTouchCount = null;
    let realGamepadButtonIDsList = gamepadButtonIDsList;
    if (!isNaN(gamepadButtonIDsList[0])) {
        multipleTouchCount = gamepadButtonIDsList[0];
        realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
    }

    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        if (gamepadButtonIDs.length == 1) {
            for (let key in GamepadButtonID) {
                gamepadButtonIDs.push(GamepadButtonID[key]);
            }
        }
    }

    let areButtonTouchedRecently = true;
    let atLeastOneButtonTouchStart = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (!(button.myTouched && (multipleTouchCount == null || button.myMultipleTouchStartCount == multipleTouchCount) && button.myTimeTouched < _mySimultaneousTouchMaxDelay)) {
                areButtonTouchedRecently = false;
                break;
            }

            if (button.isTouchStart(multipleTouchCount)) {
                atLeastOneButtonTouchStart = true;
            }
        }

        if (!areButtonTouchedRecently) {
            break;
        }
    }

    return areButtonTouchedRecently && atLeastOneButtonTouchStart;
}

export function isAnyButtonTouchEnd(...gamepadButtonIDsList) {
    let multiplePressCount = null;
    let realGamepadButtonIDsList = gamepadButtonIDsList;
    if (!isNaN(gamepadButtonIDsList[0])) {
        multiplePressCount = gamepadButtonIDsList[0];
        realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
    }

    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        if (gamepadButtonIDs.length == 1) {
            for (let key in GamepadButtonID) {
                gamepadButtonIDs.push(GamepadButtonID[key]);
            }
        }
    }

    let atLeastOneButtonTouchEnd = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (button.isTouchEnd(multiplePressCount)) {
                atLeastOneButtonTouchEnd = true;
                break;
            }
        }

        if (atLeastOneButtonTouchEnd) {
            break;
        }
    }

    return atLeastOneButtonTouchEnd;
}

export function areButtonsTouchEnd(...gamepadButtonIDsList) {
    let multipleTouchCount = null;
    let realGamepadButtonIDsList = gamepadButtonIDsList;
    if (!isNaN(gamepadButtonIDsList[0])) {
        multipleTouchCount = gamepadButtonIDsList[0];
        realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
    }

    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        if (gamepadButtonIDs.length == 1) {
            for (let key in GamepadButtonID) {
                gamepadButtonIDs.push(GamepadButtonID[key]);
            }
        }
    }

    let areButtonNotTouchedRecently = true;
    let atLeastOneButtonTouchEnd = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (!(!button.myTouched && (multipleTouchCount == null || button.myMultipleTouchEndCount == multipleTouchCount) && button.myTimeNotTouched < _mySimultaneousTouchMaxDelay)) {
                areButtonNotTouchedRecently = false;
                break;
            }

            if (button.isTouchEnd(multipleTouchCount)) {
                atLeastOneButtonTouchEnd = true;
            }
        }

        if (!areButtonNotTouchedRecently) {
            break;
        }
    }

    return areButtonNotTouchedRecently && atLeastOneButtonTouchEnd;
}

export let GamepadUtils = {
    setSimultaneousPressMaxDelay,
    setSimultaneousTouchMaxDelay,
    getSimultaneousPressMaxDelay,
    getSimultaneousTouchMaxDelay,
    isAnyButtonPressStart,
    areButtonsPressStart,
    isAnyButtonPressEnd,
    areButtonsPressEnd,
    isAnyButtonTouchStart,
    areButtonsTouchStart,
    isAnyButtonTouchEnd,
    areButtonsTouchEnd
};