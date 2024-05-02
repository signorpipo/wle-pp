import { WonderlandEngine } from "@wonderlandengine/api";
import { XRUtils } from "../../cauldron/utils/xr_utils.js";
import { Globals } from "../../pp/globals.js";
import { Handedness, HandednessIndex, InputSourceType, TrackedHandJointID, TrackedHandJointIDIndex } from "./input_types.js";

export function getHandednessByString(string: string): Handedness | null {
    let handedness = null;

    switch (string) {
        case Handedness.LEFT:
            handedness = Handedness.LEFT;
            break;
        case Handedness.RIGHT:
            handedness = Handedness.RIGHT;
            break;
    }

    return handedness;
}

export function getHandednessByIndex(index: number): Handedness | null {
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

export function getInputSource(handedness: Handedness, inputSourceType: InputSourceType | null = null, engine: WonderlandEngine = Globals.getMainEngine()!): XRInputSource | null {
    let inputSource = null;

    const xrSession = XRUtils.getSession(engine);
    if (xrSession != null && xrSession.inputSources != null) {
        for (let i = 0; i < xrSession.inputSources.length; i++) {
            const input = xrSession.inputSources[i];

            const correctType = (inputSourceType == null) || (inputSourceType == InputSourceType.GAMEPAD && !input.hand) || (inputSourceType == InputSourceType.TRACKED_HAND && input.hand);
            if (correctType && input.handedness == handedness) {
                inputSource = input;
                break;
            }
        }
    }

    return inputSource;
}

export function getInputSourceTypeByHandedness(handedness: Handedness, engine: WonderlandEngine = Globals.getMainEngine()!): InputSourceType | null {
    const inputSource = InputUtils.getInputSource(handedness, undefined, engine);

    return inputSource != null ? InputUtils.getInputSourceType(inputSource) : null;
}

export function getInputSourceType(inputSource: XRInputSource): InputSourceType {
    let inputSourceType = null;

    if (inputSource.hand) {
        inputSourceType = InputSourceType.TRACKED_HAND;
    } else {
        inputSourceType = InputSourceType.GAMEPAD;
    }

    return inputSourceType;
}

export function getOppositeHandedness(handedness: Handedness): Handedness {
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

export function getJointIDByIndex(index: number): TrackedHandJointID | null {
    let jointID = null;

    let jointIDKey = null;
    for (const jointIDIndexKey in TrackedHandJointIDIndex) {
        if (TrackedHandJointIDIndex[jointIDIndexKey as keyof typeof TrackedHandJointIDIndex] == index) {
            jointIDKey = jointIDIndexKey;
            break;
        }
    }

    if (jointIDKey != null) {
        jointID = TrackedHandJointID[jointIDKey as keyof typeof TrackedHandJointID];
    }

    return jointID;
}

export const InputUtils = {
    getHandednessByString,
    getHandednessByIndex,
    getInputSource,
    getInputSourceTypeByHandedness,
    getInputSourceType,
    getOppositeHandedness,
    getJointIDByIndex
} as const;