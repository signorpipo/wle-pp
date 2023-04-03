import { Howler } from "howler";

export function isAudioPlaybackBlocked() {
    let isBlocked = false;

    if (Howler != null && Howler.state != "running") {
        isBlocked = true;
    }

    return isBlocked;
}

export let AudioUtils = {
    isAudioPlaybackBlocked
};