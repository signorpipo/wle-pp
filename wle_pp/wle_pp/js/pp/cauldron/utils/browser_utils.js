export function isMobile() {
    return /Mobi/i.test(window.navigator.userAgent);
}
export function isDesktop() {
    return !isMobile();
}

export let BrowserUtils = {
    isMobile,
    isDesktop
};