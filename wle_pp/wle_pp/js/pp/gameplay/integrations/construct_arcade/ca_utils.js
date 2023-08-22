import { Globals } from "../../../pp/globals";

let _myDummyServer = null;
let _myUseDummyServerOnSDKMissing = false;
let _myUseDummyServerOnError = false;

export let CAError = {
    DUMMY_NOT_INITIALIZED: 0,
    CA_SDK_MISSING: 1,
    SUBMIT_SCORE_FAILED: 2,
    GET_LEADERBOARD_FAILED: 3,
    GET_USER_FAILED: 4,
    USER_HAS_NO_SCORE: 5
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

export function isSDKAvailable(engine = Globals.getMainEngine()) {
    return "casdk" in Globals.getWindow(engine);
}

export function getSDK(engine = Globals.getMainEngine()) {
    return Globals.getWindow(engine).casdk;
}

export function getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, useDummyServerOverride = null, engine = Globals.getMainEngine()) {
    if (CAUtils.isSDKAvailable(engine)) {
        let casdk = CAUtils.getSDK(engine);
        if (!aroundPlayer) {
            try {
                casdk.getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount).then(function (result) {
                    if (result.leaderboard) {
                        if (onDoneCallback) {
                            onDoneCallback(result.leaderboard);
                        }
                    } else {
                        if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                            (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                            CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback);
                        } else if (onErrorCallback) {
                            let error = {};
                            error.reason = "Get leaderboard failed";
                            error.type = CAError.GET_LEADERBOARD_FAILED;
                            onErrorCallback(error, result);
                        }
                    }
                }).catch(function (result) {
                    if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback);
                    } else if (onErrorCallback) {
                        let error = {};
                        error.reason = "Get leaderboard failed";
                        error.type = CAError.GET_LEADERBOARD_FAILED;
                        onErrorCallback(error, result);
                    }
                });
            } catch (error) {
                if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                    (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                    CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback);
                } else if (onErrorCallback) {
                    let error = {};
                    error.reason = "Get leaderboard failed";
                    error.type = CAError.GET_LEADERBOARD_FAILED;
                    onErrorCallback(error, null);
                }
            }
        } else {
            CAUtils.getUser(
                function (user) {
                    let userName = user.displayName;
                    try {
                        casdk.getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount).then(function (result) {
                            if (result.leaderboard) {
                                let userValid = false;
                                for (let value of result.leaderboard) {
                                    if (value.displayName == userName && value.score != 0) {
                                        userValid = true;
                                        break;
                                    }
                                }
                                if (userValid) {
                                    if (onDoneCallback) {
                                        onDoneCallback(result.leaderboard);
                                    }
                                } else {
                                    if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                                        CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback);
                                    } else if (onErrorCallback) {
                                        let error = {};
                                        error.reason = "Searching for around player but the user has not submitted a score yet";
                                        error.type = CAError.USER_HAS_NO_SCORE;
                                        onErrorCallback(error, result);
                                    }
                                }
                            } else {
                                if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                                    (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                                    CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback);
                                } else if (onErrorCallback) {
                                    let error = {};
                                    error.reason = "Get leaderboard failed";
                                    error.type = CAError.GET_LEADERBOARD_FAILED;
                                    onErrorCallback(error, result);
                                }
                            }
                        }).catch(function (result) {
                            if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                                (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                                CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback);
                            } else if (onErrorCallback) {
                                let error = {};
                                error.reason = "Get leaderboard failed";
                                error.type = CAError.GET_LEADERBOARD_FAILED;
                                onErrorCallback(error, result);
                            }
                        });
                    } catch (error) {
                        if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                            (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                            CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback);
                        } else if (onErrorCallback) {
                            let error = {};
                            error.reason = "Get leaderboard failed";
                            error.type = CAError.GET_LEADERBOARD_FAILED;
                            onErrorCallback(error, null);
                        }
                    }
                },
                function () {
                    if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback);
                    } else if (onErrorCallback) {
                        let error = {};
                        error.reason = "Searching for around player but the user can't be retrieved";
                        error.type = CAError.GET_USER_FAILED;
                        onErrorCallback(error, null);
                    }
                },
                false,
                engine);
        }
    } else {
        if (_myDummyServer != null && _myDummyServer.getLeaderboard != null &&
            (_myUseDummyServerOnSDKMissing && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
            CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback);
        } else if (onErrorCallback) {
            let error = {};
            error.reason = "Construct Arcade SDK missing";
            error.type = CAError.CA_SDK_MISSING;
            onErrorCallback(error, null);
        }
    }
}

export function getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback) {
    if (_myDummyServer) {
        _myDummyServer.getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback);
    } else {
        if (onErrorCallback) {
            let error = {};
            error.reason = "Dummy server not initialized";
            error.type = CAError.DUMMY_NOT_INITIALIZED;
            onErrorCallback(error, null);
        }
    }
}

export function submitScore(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, useDummyServerOverride = null, engine = Globals.getMainEngine()) {
    if (CAUtils.isSDKAvailable(engine)) {
        let casdk = CAUtils.getSDK(engine);

        try {
            casdk.submitScore(leaderboardID, scoreToSubmit).then(function (result) {
                if (result.error) {
                    if (_myDummyServer != null && _myDummyServer.submitScore != null &&
                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback);
                    } else if (onErrorCallback) {
                        let error = {};
                        error.reason = "Submit score failed";
                        error.type = CAError.SUBMIT_SCORE_FAILED;
                        onErrorCallback(error, result);
                    }
                } else {
                    onDoneCallback();
                }
            }).catch(function (result) {
                if (_myDummyServer != null && _myDummyServer.submitScore != null &&
                    (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                    CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback);
                } else if (onErrorCallback) {
                    let error = {};
                    error.reason = "Submit score failed";
                    error.type = CAError.SUBMIT_SCORE_FAILED;
                    onErrorCallback(error, result);
                }
            });
        } catch (error) {
            if (_myDummyServer != null && _myDummyServer.submitScore != null &&
                (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback);
            } else if (onErrorCallback) {
                let error = {};
                error.reason = "Submit score failed";
                error.type = CAError.SUBMIT_SCORE_FAILED;
                onErrorCallback(error, null);
            }
        }
    } else {
        if (_myDummyServer != null && _myDummyServer.submitScore != null &&
            (_myUseDummyServerOnSDKMissing && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
            CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback);
        } else if (onErrorCallback) {
            let error = {};
            error.reason = "Construct Arcade SDK missing";
            error.type = CAError.CA_SDK_MISSING;
            onErrorCallback(error, null);
        }
    }
}

export function submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback) {
    if (_myDummyServer) {
        _myDummyServer.submitScore(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback);
    } else {
        if (onErrorCallback) {
            let error = {};
            error.reason = "Dummy server not initialized";
            error.type = CAError.DUMMY_NOT_INITIALIZED;
            onErrorCallback(error, null);
        }
    }
}

export function getUser(onDoneCallback, onErrorCallback, useDummyServerOverride = null, engine = Globals.getMainEngine()) {
    if (CAUtils.isSDKAvailable(engine)) {
        let casdk = CAUtils.getSDK(engine);

        try {
            casdk.getUser().then(function (result) {
                if (result.user) {
                    if (onDoneCallback) {
                        onDoneCallback(result.user);
                    }
                } else {
                    if (_myDummyServer != null && _myDummyServer.getUser != null &&
                        (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        CAUtils.getUserDummy(onDoneCallback, onErrorCallback);
                    } else if (onErrorCallback) {
                        let error = {};
                        error.reason = "Get user failed";
                        error.type = CAError.GET_USER_FAILED;
                        onErrorCallback(error, result);
                    }
                }
            }).catch(function (result) {
                if (_myDummyServer != null && _myDummyServer.getUser != null &&
                    (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                    CAUtils.getUserDummy(onDoneCallback, onErrorCallback);
                } else if (onErrorCallback) {
                    let error = {};
                    error.reason = "Get user failed";
                    error.type = CAError.GET_USER_FAILED;
                    onErrorCallback(error, result);
                }
            });
        } catch (error) {
            if (_myDummyServer != null && _myDummyServer.getUser != null &&
                (_myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                CAUtils.getUserDummy(onDoneCallback, onErrorCallback);
            } else if (onErrorCallback) {
                let error = {};
                error.reason = "Get user failed";
                error.type = CAError.GET_USER_FAILED;
                onErrorCallback(error, null);
            }
        }
    } else {
        if (_myDummyServer != null && _myDummyServer.getUser != null &&
            (_myUseDummyServerOnSDKMissing && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
            CAUtils.getUserDummy(onDoneCallback, onErrorCallback);
        } else if (onErrorCallback) {
            let error = {};
            error.reason = "Construct Arcade SDK missing";
            error.type = CAError.CA_SDK_MISSING;
            onErrorCallback(error, null);
        }
    }
}

export function getUserDummy(onDoneCallback, onErrorCallback) {
    if (_myDummyServer) {
        _myDummyServer.getUser(onDoneCallback, onErrorCallback);
    } else {
        if (onErrorCallback) {
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