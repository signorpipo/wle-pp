let _myDummyServer = null;
let _myUseDummyServerOnSDKMissing = false;
let _myUseDummyServerOnError = false;

export let CAError = {
    NONE: 0,
    CA_SDK_MISSING: 1,
    DUMMY_NOT_INITIALIZED: 2,
    GET_LEADERBOARD_FAILED: 3,
    SUBMIT_SCORE_FAILED: 4,
    GET_USER_FAILED: 5,
    USER_NOT_LOGGED_IN: 6,
    USER_HAS_NO_SCORE: 7
};

export function setUseDummyServerOnSDKMissing(useDummyServer) {
    _myUseDummyServerOnSDKMissing = useDummyServer;
}

export function setUseDummyServerOnError(useDummyServer) {
    _myUseDummyServerOnError = useDummyServer;
}

export function setDummyServer(dummyServer) {
    _myDummyServer = dummyServer;
}

export function isUseDummyServerOnSDKMissing() {
    return _myUseDummyServerOnSDKMissing;
}

export function isUseDummyServerOnError() {
    return _myUseDummyServerOnError;
}

export function getDummyServer() {
    return _myDummyServer;
}

export function isSDKAvailable() {
    return window.heyVR != null;
}

export function getSDK() {
    return window.heyVR;
}

export function getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback = null, onErrorCallback = null, useDummyServerOverride = null) {
    if (CAUtils.isSDKAvailable()) {
        try {
            _getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount).then(function (result) {
                if (result.leaderboard != null) {
                    if (!aroundPlayer) {
                        if (onDoneCallback != null) {
                            onDoneCallback(result.leaderboard);
                        }
                    } else {
                        let userLeaderboard = result.leaderboard;
                        CAUtils.getUser(
                            function (user) {
                                let userName = user.displayName;
                                let userValid = false;
                                for (let userLeaderboardEntry of userLeaderboard) {
                                    if (userLeaderboardEntry.displayName == userName) {
                                        userValid = true;
                                        break;
                                    }
                                }
                                if (userValid) {
                                    if (onDoneCallback != null) {
                                        onDoneCallback(userLeaderboard);
                                    }
                                } else {
                                    if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                                        CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, CAError.USER_HAS_NO_SCORE);
                                    } else if (onErrorCallback != null) {
                                        let error = {};
                                        error.reason = "Searching for around player but the user has not submitted a score yet";
                                        error.type = CAError.USER_HAS_NO_SCORE;
                                        onErrorCallback(error, null);
                                    }
                                }
                            },
                            function (error, result) {
                                if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                                    (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                                    CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, error.type);
                                } else if (onErrorCallback != null) {
                                    onErrorCallback(error, result);
                                }
                            },
                            false);
                    }
                } else {
                    if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, CAError.GET_LEADERBOARD_FAILED);
                    } else if (onErrorCallback != null) {
                        let error = {};
                        error.reason = "Get leaderboard failed";
                        error.type = CAError.GET_LEADERBOARD_FAILED;
                        onErrorCallback(error, result);
                    }
                }
            }).catch(function (result) {
                if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                    (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                    CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, CAError.GET_LEADERBOARD_FAILED);
                } else if (onErrorCallback != null) {
                    let error = {};
                    error.reason = "Get leaderboard failed";
                    error.type = CAError.GET_LEADERBOARD_FAILED;
                    onErrorCallback(error, result);
                }
            });
        } catch (error) {
            if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, CAError.GET_LEADERBOARD_FAILED);
            } else if (onErrorCallback != null) {
                let error = {};
                error.reason = "Get leaderboard failed";
                error.type = CAError.GET_LEADERBOARD_FAILED;
                onErrorCallback(error, null);
            }
        }
    } else {
        if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
            (_myUseDummyServerOnSDKMissing && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
            CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, CAError.CA_SDK_MISSING);
        } else if (onErrorCallback != null) {
            let error = {};
            error.reason = "Construct Arcade SDK missing";
            error.type = CAError.CA_SDK_MISSING;
            onErrorCallback(error, null);
        }
    }
}

export function getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback = null, onErrorCallback = null, caError = CAError.NONE) {
    if (_myDummyServer) {
        _myDummyServer.getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, caError);
    } else {
        if (onErrorCallback != null) {
            let error = {};
            error.reason = "Dummy server not initialized";
            error.type = CAError.DUMMY_NOT_INITIALIZED;
            onErrorCallback(error, null);
        }
    }
}

export function submitScore(leaderboardID, scoreToSubmit, onDoneCallback = null, onErrorCallback = null, useDummyServerOverride = null) {
    if (CAUtils.isSDKAvailable()) {
        try {
            _submitScore(leaderboardID, scoreToSubmit).then(function (result) {
                if (result.scoreSubmitted) {
                    if (onDoneCallback != null) {
                        onDoneCallback();
                    }
                } else if (result.scoreSubmitted != null) {
                    if (_myDummyServer != null && _myDummyServer.submitScore != null &&
                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, CAError.USER_NOT_LOGGED_IN);
                    } else if (onErrorCallback != null) {
                        let error = {};
                        error.reason = "The score can't be submitted because the user is not logged in";
                        error.type = CAError.USER_NOT_LOGGED_IN;
                        onErrorCallback(error, result);
                    }
                } else {
                    if (_myDummyServer != null && _myDummyServer.submitScore != null &&
                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, CAError.SUBMIT_SCORE_FAILED);
                    } else if (onErrorCallback != null) {
                        let error = {};
                        error.reason = "Submit score failed";
                        error.type = CAError.SUBMIT_SCORE_FAILED;
                        onErrorCallback(error, result);
                    }
                }
            }).catch(function (result) {
                if (_myDummyServer != null && _myDummyServer.submitScore != null &&
                    (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                    CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, CAError.SUBMIT_SCORE_FAILED);
                } else if (onErrorCallback != null) {
                    let error = {};
                    error.reason = "Submit score failed";
                    error.type = CAError.SUBMIT_SCORE_FAILED;
                    onErrorCallback(error, result);
                }
            });
        } catch (error) {
            if (_myDummyServer != null && _myDummyServer.submitScore != null &&
                (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, CAError.SUBMIT_SCORE_FAILED);
            } else if (onErrorCallback != null) {
                let error = {};
                error.reason = "Submit score failed";
                error.type = CAError.SUBMIT_SCORE_FAILED;
                onErrorCallback(error, null);
            }
        }
    } else {
        if (_myDummyServer != null && _myDummyServer.submitScore != null &&
            (_myUseDummyServerOnSDKMissing && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
            CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, CAError.CA_SDK_MISSING);
        } else if (onErrorCallback != null) {
            let error = {};
            error.reason = "Construct Arcade SDK missing";
            error.type = CAError.CA_SDK_MISSING;
            onErrorCallback(error, null);
        }
    }
}

export function submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback = null, onErrorCallback = null, caError = CAError.NONE) {
    if (_myDummyServer) {
        _myDummyServer.submitScore(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, caError);
    } else {
        if (onErrorCallback != null) {
            let error = {};
            error.reason = "Dummy server not initialized";
            error.type = CAError.DUMMY_NOT_INITIALIZED;
            onErrorCallback(error, null);
        }
    }
}

export function getUser(onDoneCallback = null, onErrorCallback = null, useDummyServerOverride = null) {
    if (CAUtils.isSDKAvailable()) {
        try {
            _getUser().then(function (result) {
                if (result.user != null && result.user.displayName != null) {
                    if (onDoneCallback != null) {
                        onDoneCallback(result.user);
                    }
                } else if (result.user != null) {
                    if (_myDummyServer != null && _myDummyServer.getUser != null &&
                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        CAUtils.getUserDummy(onDoneCallback, onErrorCallback, CAError.USER_NOT_LOGGED_IN);
                    } else if (onErrorCallback != null) {
                        let error = {};
                        error.reason = "User not logged in";
                        error.type = CAError.USER_NOT_LOGGED_IN;
                        onErrorCallback(error, result);
                    }
                } else {
                    if (_myDummyServer != null && _myDummyServer.getUser != null &&
                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        CAUtils.getUserDummy(onDoneCallback, onErrorCallback, CAError.GET_USER_FAILED);
                    } else if (onErrorCallback != null) {
                        let error = {};
                        error.reason = "Get user failed";
                        error.type = CAError.GET_USER_FAILED;
                        onErrorCallback(error, result);
                    }
                }
            }).catch(function (result) {
                if (_myDummyServer != null && _myDummyServer.getUser != null &&
                    (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                    CAUtils.getUserDummy(onDoneCallback, onErrorCallback, CAError.GET_USER_FAILED);
                } else if (onErrorCallback != null) {
                    let error = {};
                    error.reason = "Get user failed";
                    error.type = CAError.GET_USER_FAILED;
                    onErrorCallback(error, result);
                }
            });
        } catch (error) {
            if (_myDummyServer != null && _myDummyServer.getUser != null &&
                (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                CAUtils.getUserDummy(onDoneCallback, onErrorCallback, CAError.GET_USER_FAILED);
            } else if (onErrorCallback != null) {
                let error = {};
                error.reason = "Get user failed";
                error.type = CAError.GET_USER_FAILED;
                onErrorCallback(error, null);
            }
        }
    } else {
        if (_myDummyServer != null && _myDummyServer.getUser != null &&
            (_myUseDummyServerOnSDKMissing && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
            CAUtils.getUserDummy(onDoneCallback, onErrorCallback, CAError.CA_SDK_MISSING);
        } else if (onErrorCallback != null) {
            let error = {};
            error.reason = "Construct Arcade SDK missing";
            error.type = CAError.CA_SDK_MISSING;
            onErrorCallback(error, null);
        }
    }
}

export function getUserDummy(onDoneCallback = null, onErrorCallback = null, caError = CAError.NONE) {
    if (_myDummyServer) {
        _myDummyServer.getUser(onDoneCallback, onErrorCallback, caError);
    } else {
        if (onErrorCallback != null) {
            let error = {};
            error.reason = "Dummy server not initialized";
            error.type = CAError.DUMMY_NOT_INITIALIZED;
            onErrorCallback(error, null);
        }
    }
}

export let CAUtils = {
    setUseDummyServerOnSDKMissing,
    setUseDummyServerOnError,
    setDummyServer,
    isUseDummyServerOnSDKMissing,
    isUseDummyServerOnError,
    getDummyServer,
    isSDKAvailable,
    getSDK,
    getLeaderboard,
    getLeaderboardDummy,
    submitScore,
    submitScoreDummy,
    getUser,
    getUserDummy
};




function _getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount) {
    let heyVR = CAUtils.getSDK();

    if (aroundPlayer) {
        return heyVR.leaderboard.getMy(leaderboardID, scoresAmount).then(function (result) {
            let adjustedLeaderboard = [];
            for (let leaderboardEntry of result) {
                adjustedLeaderboard.push({ rank: leaderboardEntry.rank - 1, displayName: leaderboardEntry.user, score: leaderboardEntry.score });
            }
            return { leaderboard: adjustedLeaderboard };
        }).catch(function (error) {
            if (error != null && error.status != null && error.status.debug == "err_unauthenticated") {
                return { leaderboard: [] };
            } else {
                return { leaderboard: null };
            }
        });
    } else {
        return heyVR.leaderboard.get(leaderboardID, scoresAmount).then(function (result) {
            let adjustedLeaderboard = [];
            for (let leaderboardEntry of result) {
                adjustedLeaderboard.push({ rank: leaderboardEntry.rank - 1, displayName: leaderboardEntry.user, score: leaderboardEntry.score });
            }
            return { leaderboard: adjustedLeaderboard };
        }).catch(function () {
            return { leaderboard: null };
        });
    }
}

function _submitScore(leaderboardID, scoreToSubmit) {
    let heyVR = CAUtils.getSDK();
    return heyVR.leaderboard.postScore(leaderboardID, scoreToSubmit).then(function () {
        return { scoreSubmitted: true };
    }).catch(function (error) {
        if (error != null && error.status != null && error.status.debug == "err_unauthenticated") {
            return { scoreSubmitted: false };
        } else {
            return { scoreSubmitted: null };
        }
    });
}

function _getUser() {
    let heyVR = CAUtils.getSDK();
    return heyVR.user.getName().then(result => {
        return { user: { displayName: result } };
    }).catch(function (error) {
        if (error != null && error.status != null && error.status.debug == "err_unauthenticated") {
            return { user: { displayName: null } };
        } else {
            return { user: null };
        }
    });
}