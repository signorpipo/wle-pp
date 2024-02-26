export let ConsoleVRWidgetConsoleFunction = {
    DEBUG: 0,
    WARN: 1,
    ERROR: 2,
    LOG: 3,
    INFO: 4,
    ASSERT: 5
};

export let ConsoleVRWidgetSender = {
    BROWSER_CONSOLE: 0,
    CONSOLE_VR: 1,
    WINDOW: 2
};

export let ConsoleVRWidgetPulseOnNewMessage = {
    NEVER: 0,
    ALWAYS: 1,
    WHEN_HIDDEN: 2
};

export let ConsoleVRWidgetMessageType = {
    DEBUG: 0,
    WARN: 1,
    ERROR: 2,
    LOG: 3
};

export let OverrideBrowserConsoleFunctions = {
    NONE: 0,
    ALL: 1,
    ERRORS_AND_WARNS: 2
};