PP.BrowserUtils = {
    isMobile: function () {
        return /Mobi/i.test(window.navigator.userAgent);
    },
    isDesktop: function () {
        return !PP.BrowserUtils.isMobile();
    },
};