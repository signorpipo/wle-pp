PP.GamepadUtils = {
    _mySimultaneousPressMaxDelay: 0.15,
    _mySimultaneousTouchMaxDelay: 0.15,
    setSimultaneousPressMaxDelay: function (simultaneousPressMaxDelay) {
        PP.GamepadUtils._mySimultaneousPressMaxDelay = simultaneousPressMaxDelay;
    },
    setSimultaneousTouchMaxDelay: function (simultaneousTouchMaxDelay) {
        PP.GamepadUtils._mySimultaneousTouchMaxDelay = simultaneousTouchMaxDelay;
    },
    getSimultaneousPressMaxDelay: function () {
        return PP.GamepadUtils._mySimultaneousPressMaxDelay;
    },
    getSimultaneousTouchMaxDelay: function () {
        return PP.GamepadUtils._mySimultaneousTouchMaxDelay;
    },

    // gamepadButtonIDsList is a sequence of a gamepads and a list of buttonIDs like this ([gamepad1, squeeze, top, select], [gamepad2, bottom, squeeze, select], ...)
    // if the first parameter is a number it's used as multiplePressCount
    // if the buttonIDs list is empty for a given gamepad, it means that every button will be included
    isAnyButtonPressStart: function (...gamepadButtonIDsList) {
        let multiplePressCount = null;
        let realGamepadButtonIDsList = gamepadButtonIDsList;
        if (!isNaN(gamepadButtonIDsList[0])) {
            multiplePressCount = gamepadButtonIDsList[0];
            realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
        }

        for (let gamepadButtonIDs of realGamepadButtonIDsList) {
            if (gamepadButtonIDs.length == 1) {
                for (let key in PP.GamepadButtonID) {
                    gamepadButtonIDs.push(PP.GamepadButtonID[key]);
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
    },
    // gamepadButtonIDsList is a sequence of a gamepads and a list of buttonIDs like this ([gamepad1, squeeze, top, select], [gamepad2, bottom, squeeze, select], ...)
    // if the first parameter is a number it's used as multiplePressCount
    // if the buttonIDs list is empty for a given gamepad, it means that every button will be included
    areButtonsPressStart: function (...gamepadButtonIDsList) {
        let multiplePressCount = null;
        let realGamepadButtonIDsList = gamepadButtonIDsList;
        if (!isNaN(gamepadButtonIDsList[0])) {
            multiplePressCount = gamepadButtonIDsList[0];
            realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
        }

        for (let gamepadButtonIDs of realGamepadButtonIDsList) {
            if (gamepadButtonIDs.length == 1) {
                for (let key in PP.GamepadButtonID) {
                    gamepadButtonIDs.push(PP.GamepadButtonID[key]);
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

                if (!(button.myIsPressed && (multiplePressCount == null || button.myMultiplePressStartCount == multiplePressCount) && button.myTimePressed < PP.GamepadUtils._mySimultaneousPressMaxDelay)) {
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
    },
    isAnyButtonPressEnd: function (...gamepadButtonIDsList) {
        let multiplePressCount = null;
        let realGamepadButtonIDsList = gamepadButtonIDsList;
        if (!isNaN(gamepadButtonIDsList[0])) {
            multiplePressCount = gamepadButtonIDsList[0];
            realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
        }

        for (let gamepadButtonIDs of realGamepadButtonIDsList) {
            if (gamepadButtonIDs.length == 1) {
                for (let key in PP.GamepadButtonID) {
                    gamepadButtonIDs.push(PP.GamepadButtonID[key]);
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
    },
    areButtonsPressEnd: function (...gamepadButtonIDsList) {
        let multiplePressCount = null;
        let realGamepadButtonIDsList = gamepadButtonIDsList;
        if (!isNaN(gamepadButtonIDsList[0])) {
            multiplePressCount = gamepadButtonIDsList[0];
            realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
        }

        for (let gamepadButtonIDs of realGamepadButtonIDsList) {
            if (gamepadButtonIDs.length == 1) {
                for (let key in PP.GamepadButtonID) {
                    gamepadButtonIDs.push(PP.GamepadButtonID[key]);
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

                if (!(!button.myIsPressed && (multiplePressCount == null || button.myMultiplePressEndCount == multiplePressCount) && button.myTimeNotPressed < PP.GamepadUtils._mySimultaneousPressMaxDelay)) {
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
    },
    isAnyButtonTouchStart: function (...gamepadButtonIDsList) {
        let multiplePressCount = null;
        let realGamepadButtonIDsList = gamepadButtonIDsList;
        if (!isNaN(gamepadButtonIDsList[0])) {
            multiplePressCount = gamepadButtonIDsList[0];
            realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
        }

        for (let gamepadButtonIDs of realGamepadButtonIDsList) {
            if (gamepadButtonIDs.length == 1) {
                for (let key in PP.GamepadButtonID) {
                    gamepadButtonIDs.push(PP.GamepadButtonID[key]);
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
    },
    areButtonsTouchStart: function (...gamepadButtonIDsList) {
        let multipleTouchCount = null;
        let realGamepadButtonIDsList = gamepadButtonIDsList;
        if (!isNaN(gamepadButtonIDsList[0])) {
            multipleTouchCount = gamepadButtonIDsList[0];
            realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
        }

        for (let gamepadButtonIDs of realGamepadButtonIDsList) {
            if (gamepadButtonIDs.length == 1) {
                for (let key in PP.GamepadButtonID) {
                    gamepadButtonIDs.push(PP.GamepadButtonID[key]);
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

                if (!(button.myIsTouched && (multipleTouchCount == null || button.myMultipleTouchStartCount == multipleTouchCount) && button.myTimeTouched < PP.GamepadUtils._mySimultaneousTouchMaxDelay)) {
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
    },
    isAnyButtonTouchEnd: function (...gamepadButtonIDsList) {
        let multiplePressCount = null;
        let realGamepadButtonIDsList = gamepadButtonIDsList;
        if (!isNaN(gamepadButtonIDsList[0])) {
            multiplePressCount = gamepadButtonIDsList[0];
            realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
        }

        for (let gamepadButtonIDs of realGamepadButtonIDsList) {
            if (gamepadButtonIDs.length == 1) {
                for (let key in PP.GamepadButtonID) {
                    gamepadButtonIDs.push(PP.GamepadButtonID[key]);
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
    },
    areButtonsTouchEnd: function (...gamepadButtonIDsList) {
        let multipleTouchCount = null;
        let realGamepadButtonIDsList = gamepadButtonIDsList;
        if (!isNaN(gamepadButtonIDsList[0])) {
            multipleTouchCount = gamepadButtonIDsList[0];
            realGamepadButtonIDsList = gamepadButtonIDsList.slice(1);
        }

        for (let gamepadButtonIDs of realGamepadButtonIDsList) {
            if (gamepadButtonIDs.length == 1) {
                for (let key in PP.GamepadButtonID) {
                    gamepadButtonIDs.push(PP.GamepadButtonID[key]);
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

                if (!(!button.myIsTouched && (multipleTouchCount == null || button.myMultipleTouchEndCount == multipleTouchCount) && button.myTimeNotTouched < PP.GamepadUtils._mySimultaneousTouchMaxDelay)) {
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
    },
};