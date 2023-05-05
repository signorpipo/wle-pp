import { XRUtils } from "../../cauldron/utils/xr_utils";
import { Globals } from "../../pp/globals";
import { Handedness, HandednessIndex, InputSourceType, TrackedHandJointID, TrackedHandJointIDIndex } from "./input_types";

export function getHandednessByIndex(index) {
    let handedness = null;

    switch (index) {
        case HandednessIndex.LEFT:
            handedness = Handedness.LEFT;
            break;
        case HandednessIndex.RIGHT:
            handedness = Handedness.RIGHT;
            break;
    }

    return handedness;
}

export function getInputSource(handedness, inputSourceType = null, engine = Globals.getMainEngine()) {
    let inputSource = null;

    let xrSession = XRUtils.getSession(engine);
    if (xrSession != null && xrSession.inputSources) {
        for (let i = 0; i < xrSession.inputSources.length; i++) {
            let input = xrSession.inputSources[i];

            let correctType = (!inputSourceType) || (inputSourceType == InputSourceType.GAMEPAD && !input.hand) || (inputSourceType == InputSourceType.TRACKED_HAND && input.hand);
            if (correctType && input.handedness == handedness) {
                inputSource = input;
                break;
            }
        }
    }

    return inputSource;
}

export function getInputSourceTypeByHandedness(handedness, engine) {
    let inputSource = InputUtils.getInputSource(handedness, undefined, engine);

    return InputUtils.getInputSourceType(inputSource);
}

export function getInputSourceType(inputSource) {
    let inputSourceType = null;

    if (inputSource) {
        if (inputSource.hand) {
            inputSourceType = InputSourceType.TRACKED_HAND;
        } else {
            inputSourceType = InputSourceType.GAMEPAD;
        }
    }

    return inputSourceType;
}

export function getOppositeHandedness(handedness) {
    let oppositeHandedness = null;

    switch (handedness) {
        case Handedness.LEFT:
            oppositeHandedness = Handedness.RIGHT;
            break;
        case Handedness.RIGHT:
            oppositeHandedness = Handedness.LEFT;
            break;
    }

    return oppositeHandedness;
}

export function getJointIDByIndex(index) {
    let jointID = null;

    let jointIDKey = null;
    for (let jointIDIndexKey in TrackedHandJointIDIndex) {
        if (TrackedHandJointIDIndex[jointIDIndexKey] == index) {
            jointIDKey = jointIDIndexKey;
            break;
        }
    }

    if (jointIDKey != null) {
        jointID = TrackedHandJointID[jointIDKey];
    }

    return jointID;
}

export let InputUtils = {
    getHandednessByIndex,
    getInputSource,
    getInputSourceTypeByHandedness,
    getInputSourceType,
    getOppositeHandedness,
    getJointIDByIndex
};