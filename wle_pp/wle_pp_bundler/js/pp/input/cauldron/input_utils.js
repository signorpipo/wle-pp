PP.InputUtils = {
    getHandednessByIndex: function (index) {
        let handedness = null;

        switch (index) {
            case PP.HandednessIndex.LEFT:
                handedness = PP.Handedness.LEFT;
                break;
            case PP.HandednessIndex.RIGHT:
                handedness = PP.Handedness.RIGHT;
                break;
        }

        return handedness;
    },
    getInputSource: function (handedness, inputSourceType) {
        let inputSource = null;

        if (WL.xrSession && WL.xrSession.inputSources) {
            for (let i = 0; i < WL.xrSession.inputSources.length; i++) {
                let input = WL.xrSession.inputSources[i];

                let isCorrectType = (!inputSourceType) || (inputSourceType == PP.InputSourceType.GAMEPAD && !input.hand) || (inputSourceType == PP.InputSourceType.HAND && input.hand);
                if (isCorrectType && input.handedness == handedness) {
                    inputSource = input;
                    break;
                }
            }
        }

        return inputSource;
    },
    getInputSourceType: function (handedness) {
        let inputSourceType = null;

        let inputSource = PP.InputUtils.getInputSource(handedness);
        if (inputSource) {
            if (inputSource.hand) {
                inputSourceType = PP.InputSourceType.HAND;
            } else {
                inputSourceType = PP.InputSourceType.GAMEPAD;
            }
        }

        return inputSourceType;
    }
};