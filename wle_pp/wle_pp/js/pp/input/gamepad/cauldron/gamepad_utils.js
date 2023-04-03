import { GamepadButtonID } from "../gamepad_buttons";

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

    let isOnePressStart = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (button.isPressStart(multiplePressCount)) {
                isOnePressStart = true;
                break;
            }
        }

        if (isOnePressStart) {
            break;
        }
    }

    return isOnePressStart;
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
    let isOnePressStart = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (!(button.myIsPressed && (multiplePressCount == null || button.myMultiplePressStartCount == multiplePressCount) && button.myTimePressed < _mySimultaneousPressMaxDelay)) {
                areButtonPressedRecently = false;
                break;
            }

            if (button.isPressStart(multiplePressCount)) {
                isOnePressStart = true;
            }
        }

        if (!areButtonPressedRecently) {
            break;
        }
    }

    return areButtonPressedRecently && isOnePressStart;
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

    let isOnePressEnd = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (button.isPressEnd(multiplePressCount)) {
                isOnePressEnd = true;
                break;
            }
        }

        if (isOnePressEnd) {
            break;
        }
    }

    return isOnePressEnd;
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
    let isOnePressEnd = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (!(!button.myIsPressed && (multiplePressCount == null || button.myMultiplePressEndCount == multiplePressCount) && button.myTimeNotPressed < _mySimultaneousPressMaxDelay)) {
                areButtonNotPressedRecently = false;
                break;
            }

            if (button.isPressEnd(multiplePressCount)) {
                isOnePressEnd = true;
            }
        }

        if (!areButtonNotPressedRecently) {
            break;
        }
    }

    return areButtonNotPressedRecently && isOnePressEnd;
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

    let isOneTouchStart = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (button.isTouchStart(multiplePressCount)) {
                isOneTouchStart = true;
                break;
            }
        }

        if (isOneTouchStart) {
            break;
        }
    }

    return isOneTouchStart;
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
    let isOneTouchStart = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (!(button.myIsTouched && (multipleTouchCount == null || button.myMultipleTouchStartCount == multipleTouchCount) && button.myTimeTouched < _mySimultaneousTouchMaxDelay)) {
                areButtonTouchedRecently = false;
                break;
            }

            if (button.isTouchStart(multipleTouchCount)) {
                isOneTouchStart = true;
            }
        }

        if (!areButtonTouchedRecently) {
            break;
        }
    }

    return areButtonTouchedRecently && isOneTouchStart;
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

    let isOneTouchEnd = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (button.isTouchEnd(multiplePressCount)) {
                isOneTouchEnd = true;
                break;
            }
        }

        if (isOneTouchEnd) {
            break;
        }
    }

    return isOneTouchEnd;
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
    let isOneTouchEnd = false;
    for (let gamepadButtonIDs of realGamepadButtonIDsList) {
        let gamepad = gamepadButtonIDs[0];
        for (let i = 1; i < gamepadButtonIDs.length; i++) {
            let buttonID = gamepadButtonIDs[i];
            let button = gamepad.getButtonInfo(buttonID);

            if (!(!button.myIsTouched && (multipleTouchCount == null || button.myMultipleTouchEndCount == multipleTouchCount) && button.myTimeNotTouched < _mySimultaneousTouchMaxDelay)) {
                areButtonNotTouchedRecently = false;
                break;
            }

            if (button.isTouchEnd(multipleTouchCount)) {
                isOneTouchEnd = true;
            }
        }

        if (!areButtonNotTouchedRecently) {
            break;
        }
    }

    return areButtonNotTouchedRecently && isOneTouchEnd;
}

export let GamepadUtils = {
    setSimultaneousPressMaxDelay,
    setSimultaneousTouchMaxDelay,
    getSimultaneousPressMaxDelay,
    getSimultaneousTouchMaxDelay,
    isAnyButtonPressStart,
    areButtonsPressStart,
    areButtonsPressEnd,
    isAnyButtonTouchStart,
    areButtonsTouchStart,
    isAnyButtonTouchEnd,
    areButtonsTouchEnd
};