PP.AudioUtils = {
    isAudioPlaybackBlocked: function () {
        let isBlocked = false;

        if (Howler != null && Howler.state != "running") {
            isBlocked = true;
        }

        return isBlocked;
    }
}