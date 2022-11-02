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

                let isCorrectType = (!inputSourceType) || (inputSourceType == PP.InputSourceType.GAMEPAD && !input.hand) || (inputSourceType == PP.InputSourceType.TRACKED_HAND && input.hand);
                if (isCorrectType && input.handedness == handedness) {
                    inputSource = input;
                    break;
                }
            }
        }

        return inputSource;
    },
    getInputSourceTypeByHandedness: function (handedness) {
        let inputSource = PP.InputUtils.getInputSource(handedness);

        return PP.InputUtils.getInputSourceType(inputSource);
    },
    getInputSourceType: function (inputSource) {
        let inputSourceType = null;

        if (inputSource) {
            if (inputSource.hand) {
                inputSourceType = PP.InputSourceType.TRACKED_HAND;
            } else {
                inputSourceType = PP.InputSourceType.GAMEPAD;
            }
        }

        return inputSourceType;
    },
    getOppositeHandedness: function (handedness) {
        let oppositeHandedness = null;

        switch (handedness) {
            case PP.Handedness.LEFT:
                oppositeHandedness = PP.Handedness.RIGHT;
                break;
            case PP.Handedness.RIGHT:
                oppositeHandedness = PP.Handedness.LEFT;
                break;
        }

        return oppositeHandedness;
    },
    getJointTypeByIndex: function (index) {
        let jointType = null;

        let jointTypeKey = null;
        for (let jointTypeIndexKey in PP.TrackedHandJointTypeIndex) {
            if (PP.TrackedHandJointTypeIndex[jointTypeIndexKey] == index) {
                jointTypeKey = jointTypeIndexKey;
                break;
            }
        }

        if (jointTypeKey != null) {
            jointType = PP.TrackedHandJointType[jointTypeKey];
        }

        return jointType;
    },
};