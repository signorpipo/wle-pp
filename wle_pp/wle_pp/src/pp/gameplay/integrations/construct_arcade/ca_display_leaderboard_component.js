import { Component, Property, TextComponent } from "@wonderlandengine/api";
import { ComponentUtils } from "../../../cauldron/wl/utils/component_utils.js";
import { CADummyServer } from "./ca_dummy_server.js";
import { CAUtils } from "./ca_utils.js";

export class CADisplayLeaderboardComponent extends Component {
    static TypeName = "pp-ca-display-leaderboard";
    static Properties = {
        _myUsernamesTextObject: Property.object(),
        _myScoresTextObject: Property.object(),
        _myLeaderboardID: Property.string(""),
        _myLocal: Property.bool(false),
        _myAscending: Property.bool(false),
        _myScoresAmount: Property.int(10),
        _myScoreFormat: Property.enum(["Value", "Hours:Minutes:Seconds", "Minutes:Seconds", "Seconds", "Hours:Minutes", "Minutes"], "Value"),
        _myPositionAndUsernameSeparator: Property.string(" - "),
        _myNumberOfLinesBetweenScores: Property.int(1),
        _myAddDefaultCADummyServer: Property.bool(false)
    };

    init() {
        this._myUsernamesTextComponent = null;
        this._myScoresTextComponent = null;

        this._myStarted = false;
        this._myDestroyed = false;
    }

    start() {
        if (this._myAddDefaultCADummyServer) {
            CAUtils.setDummyServer(new CADummyServer());
            CAUtils.setUseDummyServerOnSDKMissing(true);
            CAUtils.setUseDummyServerOnError(true);
        }
    }

    update(dt) {
        if (!this._myStarted) {
            this._myStarted = true;

            if (this._myUsernamesTextObject != null) {
                this._myUsernamesTextComponent = this._myUsernamesTextObject.pp_getComponent(TextComponent);
            }

            if (this._myScoresTextObject != null) {
                this._myScoresTextComponent = this._myScoresTextObject.pp_getComponent(TextComponent);
            }

            this.updateLeaderboard();
        }
    }

    updateLeaderboard() {
        CAUtils.getLeaderboard(this._myLeaderboardID, this._myAscending, this._myLocal, this._myScoresAmount, this._onLeaderboardRetrieved.bind(this));
    }

    _onLeaderboardRetrieved(leaderboard) {
        if (this._myDestroyed) return;

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

        if (this._myUsernamesTextComponent != null) {
            this._myUsernamesTextComponent.text = namesText;
        }

        if (this._myScoresTextComponent != null) {
            this._myScoresTextComponent.text = scoresText;
        }
    }

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
    }

    _formatTime(score, displayHours, displayMinutes, displaySeconds) {
        let time = Math.floor(score / 1000);

        let hours = 0;
        if (displayHours) {
            hours = Math.floor(time / 3600);
            time -= hours * 3600;
        }

        let minutes = 0;
        if (displayMinutes) {
            minutes = Math.floor(time / 60);
            time -= minutes * 60;
        }

        let seconds = 0;
        if (displaySeconds) {
            seconds = Math.floor(time);
        }

        let convertedTime = "";

        if (displaySeconds) {
            convertedTime = (seconds.toFixed(0).length < 2 && (displayMinutes || displayHours)) ? "0".concat(seconds.toFixed(0)) : seconds.toFixed(0);
        }

        if (displayMinutes) {
            convertedTime = ((minutes.toFixed(0).length < 2 && (displaySeconds || displayHours)) ? "0".concat(minutes.toFixed(0)) : minutes.toFixed(0)) + (displaySeconds ? ":" + convertedTime : "");
        }

        if (displayHours) {
            convertedTime = ((hours.toFixed(0).length < 2 && (displaySeconds || displayMinutes)) ? "0".concat(hours.toFixed(0)) : hours.toFixed(0)) + (displayMinutes ? ":" + convertedTime : "");
        }

        return convertedTime;
    }

    pp_clone(targetObject) {
        let clonedComponent = ComponentUtils.cloneDefault(this, targetObject);

        return clonedComponent;
    }

    onDestroy() {
        this._myDestroyed = true;
    }
}