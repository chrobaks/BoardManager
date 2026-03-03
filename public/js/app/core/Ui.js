/**
 *-------------------------------------------
 * Ui.js
 *-------------------------------------------
 * @version 1.1.0
 * @createAt 17.06.2020 17:30
 * @updatedAt 03.03.2026 00:25
 * @author NetCoDev
 *-------------------------------------------
 **/
export default class Ui
{
    static isMobile () {
        if (navigator?.userAgentData?.mobile) {
            return navigator.userAgentData.mobile;
        }
        const isUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isIPad = navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent);

        return isUA || isIPad;
    }
}