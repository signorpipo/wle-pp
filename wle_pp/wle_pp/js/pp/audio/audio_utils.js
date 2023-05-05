import { Howler } from "howler";

export function isPlaybackBlocked() {
    let blocked = false;

    if (Howler != null && Howler.state != "running") {
        blocked = true;
    }

    return blocked;
}

export let AudioUtils = {
    isPlaybackBlocked
};