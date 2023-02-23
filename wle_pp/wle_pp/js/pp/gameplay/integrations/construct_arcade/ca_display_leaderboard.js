WL.registerComponent("pp-ca-display-leaderboard", {
    _myLeaderboardID: { type: WL.Type.String, default: "" },
    _myIsLocal: { type: WL.Type.Bool, default: false },
    _myIsAscending: { type: WL.Type.Bool, default: false },
    _myScoresAmount: { type: WL.Type.Int, default: 10 },
    _myScoreFormat: { type: WL.Type.Enum, values: ['value', 'hours:minutes:seconds', 'minutes:seconds', 'seconds', 'hours:minutes', 'minutes'], default: 'value' },
    _myPositionAndUsernameSeparator: { type: WL.Type.String, default: " - " },
    _myNumberOfLinesBetweenScores: { type: WL.Type.Int, default: 1 },
}, {
    init: function () {
    },
    start: function () {
        this._myNamesTextComponent = null;
        this._myScoresTextComponent = null;

        this._myStarted = false;

        PP.CAUtils.setDummyServer(new PP.CADummyServer());
        PP.CAUtils.setUseDummyServerOnSDKMissing(true);
        PP.CAUtils.setUseDummyServerOnError(true);
    },
    update: function (dt) {
        if (!this._myStarted) {
            this._myStarted = true;

            let namesObject = this.object.pp_getObjectByName("Names");
            let scoresObject = this.object.pp_getObjectByName("Scores");

            if (namesObject != null && scoresObject != null) {
                this._myNamesTextComponent = namesObject.pp_getComponent("text");
                this._myScoresTextComponent = scoresObject.pp_getComponent("text");
            }

            this.updateLeaderboard();
        }
    },
    updateLeaderboard: function () {
        PP.CAUtils.getLeaderboard(this._myLeaderboardID, this._myIsAscending, this._myIsLocal, this._myScoresAmount, this._onLeaderboardRetrieved.bind(this));
    },
    _onLeaderboardRetrieved(leaderboard) {
        let namesText = "";
        let scoresText = "";

        let maxRankDigit = 0;
        for (let value of leaderboard) {
            let rank = value.rank + 1;
            if (rank.toFixed(0).length > maxRankDigit) {
                maxRankDigit = rank.toFixed(0).length;
            }
        }

        for (let value of leaderboard) {
            let rank = value.rank + 1;
            let fixedRank = rank.toFixed(0);
            while (fixedRank.length < maxRankDigit) {
                fixedRank = "0".concat(fixedRank);
            }

            let newlines = "\n";
            for (let i = 0; i < this._myNumberOfLinesBetweenScores; i++) {
                newlines = newlines + "\n";
            }

            namesText = namesText.concat(fixedRank, this._myPositionAndUsernameSeparator, value.displayName, newlines);

            let convertedScore = this._formatScore(value.score);
            scoresText = scoresText.concat(convertedScore, newlines);
        }

        if (this._myNamesTextComponent != null && this._myScoresTextComponent != null) {
            this._myNamesTextComponent.text = namesText;
            this._myScoresTextComponent.text = scoresText;
        }
    },
    _formatScore(score) {
        let convertedScore = score.toString();

        if (this._myScoreFormat == 1) {
            convertedScore = this._formatTime(score, true, true, true);
        } else if (this._myScoreFormat == 2) {
            convertedScore = this._formatTime(score, false, true, true);
        } else if (this._myScoreFormat == 3) {
            convertedScore = this._formatTime(score, false, false, true);
        } else if (this._myScoreFormat == 4) {
            convertedScore = this._formatTime(score, true, true, false);
        } else if (this._myScoreFormat == 5) {
            convertedScore = this._formatTime(score, false, true, false);
        }

        return convertedScore;
    },
    _formatTime(score, hoursEnabled, minutesEnabled, secondsEnabled) {
        let time = Math.floor(score / 1000);

        let hours = 0;
        if (hoursEnabled) {
            hours = Math.floor(time / 3600);
            time -= hours * 3600;
        }

        let minutes = 0;
        if (minutesEnabled) {
            minutes = Math.floor(time / 60);
            time -= minutes * 60;
        }

        let seconds = 0;
        if (secondsEnabled) {
            seconds = Math.floor(time);
        }

        let convertedTime = "";

        if (secondsEnabled) {
            convertedTime = (seconds.toFixed(0).length < 2 && (minutesEnabled || hoursEnabled)) ? "0".concat(seconds.toFixed(0)) : seconds.toFixed(0);
        }

        if (minutesEnabled) {
            convertedTime = ((minutes.toFixed(0).length < 2 && (secondsEnabled || hoursEnabled)) ? "0".concat(minutes.toFixed(0)) : minutes.toFixed(0)) + (secondsEnabled ? ":" + convertedTime : "");
        }

        if (hoursEnabled) {
            convertedTime = ((hours.toFixed(0).length < 2 && (secondsEnabled || minutesEnabled)) ? "0".concat(hours.toFixed(0)) : hours.toFixed(0)) + (minutesEnabled ? ":" + convertedTime : "");
        }

        return convertedTime;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        clonedComponent._myLeaderboardID = this._myLeaderboardID;
        clonedComponent._myIsLocal = this._myIsLocal;
        clonedComponent._myPositionAndUsernameSeparator = this._myPositionAndUsernameSeparator;
        clonedComponent._myNumberOfLinesBetweenScores = this._myNumberOfLinesBetweenScores;

        return clonedComponent;
    },
});