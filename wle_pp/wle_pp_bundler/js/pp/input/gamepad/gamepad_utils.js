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

    // gamepadButtonTypesList is a sequence of a gamepads and a list of buttonTypes like this ([gamepad1, squeeze, top, select], [gamepad2, bottom, squeeze, select], ...)
    // if the first parameter is a number it's used as multiplePressCount
    // if the buttonTypes list is empty for a given gamepad, it means that every button will be included
    isAnyButtonPressStart: function (...gamepadButtonTypesList) {
        let multiplePressCount = null;
        let realGamepadButtonTypesList = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            multiplePressCount = gamepadButtonTypesList[0];
            realGamepadButtonTypesList = gamepadButtonTypesList.slice(1);
        }

        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            if (gamepadButtonTypes.length == 1) {
                for (let key in PP.ButtonType) {
                    gamepadButtonTypes.push(PP.ButtonType[key]);
                }
            }
        }

        let isOnePressStart = false;
        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

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
    // gamepadButtonTypesList is a sequence of a gamepads and a list of buttonTypes like this ([gamepad1, squeeze, top, select], [gamepad2, bottom, squeeze, select], ...)
    // if the first parameter is a number it's used as multiplePressCount
    // if the buttonTypes list is empty for a given gamepad, it means that every button will be included
    areButtonsPressStart: function (...gamepadButtonTypesList) {
        let multiplePressCount = null;
        let realGamepadButtonTypesList = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            multiplePressCount = gamepadButtonTypesList[0];
            realGamepadButtonTypesList = gamepadButtonTypesList.slice(1);
        }

        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            if (gamepadButtonTypes.length == 1) {
                for (let key in PP.ButtonType) {
                    gamepadButtonTypes.push(PP.ButtonType[key]);
                }
            }
        }

        let areButtonPressedRecently = true;
        let isOnePressStart = false;
        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

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
    isAnyButtonPressEnd: function (...gamepadButtonTypesList) {
        let multiplePressCount = null;
        let realGamepadButtonTypesList = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            multiplePressCount = gamepadButtonTypesList[0];
            realGamepadButtonTypesList = gamepadButtonTypesList.slice(1);
        }

        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            if (gamepadButtonTypes.length == 1) {
                for (let key in PP.ButtonType) {
                    gamepadButtonTypes.push(PP.ButtonType[key]);
                }
            }
        }

        let isOnePressEnd = false;
        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

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
    areButtonsPressEnd: function (...gamepadButtonTypesList) {
        let multiplePressCount = null;
        let realGamepadButtonTypesList = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            multiplePressCount = gamepadButtonTypesList[0];
            realGamepadButtonTypesList = gamepadButtonTypesList.slice(1);
        }

        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            if (gamepadButtonTypes.length == 1) {
                for (let key in PP.ButtonType) {
                    gamepadButtonTypes.push(PP.ButtonType[key]);
                }
            }
        }

        let areButtonNotPressedRecently = true;
        let isOnePressEnd = false;
        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

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
    isAnyButtonTouchStart: function (...gamepadButtonTypesList) {
        let multiplePressCount = null;
        let realGamepadButtonTypesList = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            multiplePressCount = gamepadButtonTypesList[0];
            realGamepadButtonTypesList = gamepadButtonTypesList.slice(1);
        }

        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            if (gamepadButtonTypes.length == 1) {
                for (let key in PP.ButtonType) {
                    gamepadButtonTypes.push(PP.ButtonType[key]);
                }
            }
        }

        let isOneTouchStart = false;
        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

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
    areButtonsTouchStart: function (...gamepadButtonTypesList) {
        let multipleTouchCount = null;
        let realGamepadButtonTypesList = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            multipleTouchCount = gamepadButtonTypesList[0];
            realGamepadButtonTypesList = gamepadButtonTypesList.slice(1);
        }

        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            if (gamepadButtonTypes.length == 1) {
                for (let key in PP.ButtonType) {
                    gamepadButtonTypes.push(PP.ButtonType[key]);
                }
            }
        }

        let areButtonTouchedRecently = true;
        let isOneTouchStart = false;
        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

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
    isAnyButtonTouchEnd: function (...gamepadButtonTypesList) {
        let multiplePressCount = null;
        let realGamepadButtonTypesList = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            multiplePressCount = gamepadButtonTypesList[0];
            realGamepadButtonTypesList = gamepadButtonTypesList.slice(1);
        }

        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            if (gamepadButtonTypes.length == 1) {
                for (let key in PP.ButtonType) {
                    gamepadButtonTypes.push(PP.ButtonType[key]);
                }
            }
        }

        let isOneTouchEnd = false;
        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

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
    areButtonsTouchEnd: function (...gamepadButtonTypesList) {
        let multipleTouchCount = null;
        let realGamepadButtonTypesList = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            multipleTouchCount = gamepadButtonTypesList[0];
            realGamepadButtonTypesList = gamepadButtonTypesList.slice(1);
        }

        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            if (gamepadButtonTypes.length == 1) {
                for (let key in PP.ButtonType) {
                    gamepadButtonTypes.push(PP.ButtonType[key]);
                }
            }
        }

        let areButtonNotTouchedRecently = true;
        let isOneTouchEnd = false;
        for (let gamepadButtonTypes of realGamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

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