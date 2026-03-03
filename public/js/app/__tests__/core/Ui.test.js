import { describe, it, expect } from 'vitest';
import Ui from '../../core/Ui.js';

describe('Ui', () => {
    describe('isMobile', () => {
        it('should detect mobile via userAgentData', () => {
            // Mock userAgentData
            const originalUAD = navigator.userAgentData;
            Object.defineProperty(navigator, 'userAgentData', {
                value: { mobile: true },
                writable: true,
                configurable: true
            });

            expect(Ui.isMobile()).toBe(true);

            Object.defineProperty(navigator, 'userAgentData', {
                value: originalUAD,
                writable: true,
                configurable: true
            });
        });

        it('should return false when userAgentData indicates desktop', () => {
            const originalUAD = navigator.userAgentData;
            Object.defineProperty(navigator, 'userAgentData', {
                value: { mobile: false },
                writable: true,
                configurable: true
            });

            expect(Ui.isMobile()).toBe(false);

            Object.defineProperty(navigator, 'userAgentData', {
                value: originalUAD,
                writable: true,
                configurable: true
            });
        });

        it('should detect Android devices', () => {
            const originalUA = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'userAgentData', {
                value: null,
                writable: true,
                configurable: true
            });

            expect(Ui.isMobile()).toBe(true);

            Object.defineProperty(navigator, 'userAgent', {
                value: originalUA,
                writable: true,
                configurable: true
            });
        });

        it('should detect iPhone devices', () => {
            const originalUA = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'userAgentData', {
                value: null,
                writable: true,
                configurable: true
            });

            expect(Ui.isMobile()).toBe(true);

            Object.defineProperty(navigator, 'userAgent', {
                value: originalUA,
                writable: true,
                configurable: true
            });
        });

        it('should detect iPad devices', () => {
            const originalUA = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X)',
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'userAgentData', {
                value: null,
                writable: true,
                configurable: true
            });

            expect(Ui.isMobile()).toBe(true);

            Object.defineProperty(navigator, 'userAgent', {
                value: originalUA,
                writable: true,
                configurable: true
            });
        });

        it('should detect iPod devices', () => {
            const originalUA = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (iPod; CPU like Mac OS X)',
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'userAgentData', {
                value: null,
                writable: true,
                configurable: true
            });

            expect(Ui.isMobile()).toBe(true);

            Object.defineProperty(navigator, 'userAgent', {
                value: originalUA,
                writable: true,
                configurable: true
            });
        });

        it('should detect Macintosh with multi-touch as iPad', () => {
            const originalUA = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'maxTouchPoints', {
                value: 5,
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'userAgentData', {
                value: null,
                writable: true,
                configurable: true
            });

            expect(Ui.isMobile()).toBe(true);

            Object.defineProperty(navigator, 'userAgent', {
                value: originalUA,
                writable: true,
                configurable: true
            });
        });

        it('should return false for desktop browsers', () => {
            const originalUA = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0',
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'userAgentData', {
                value: { mobile: false },
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'maxTouchPoints', {
                value: 0,
                writable: true,
                configurable: true
            });

            expect(Ui.isMobile()).toBe(false);

            Object.defineProperty(navigator, 'userAgent', {
                value: originalUA,
                writable: true,
                configurable: true
            });
        });

        it('should handle webOS devices', () => {
            const originalUA = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (webOS; U; Linux armv7l)',
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'userAgentData', {
                value: null,
                writable: true,
                configurable: true
            });

            expect(Ui.isMobile()).toBe(true);

            Object.defineProperty(navigator, 'userAgent', {
                value: originalUA,
                writable: true,
                configurable: true
            });
        });

        it('should handle BlackBerry devices', () => {
            const originalUA = navigator.userAgent;
            Object.defineProperty(navigator, 'userAgent', {
                value: 'Mozilla/5.0 (BlackBerry)',
                writable: true,
                configurable: true
            });
            Object.defineProperty(navigator, 'userAgentData', {
                value: null,
                writable: true,
                configurable: true
            });

            expect(Ui.isMobile()).toBe(true);

            Object.defineProperty(navigator, 'userAgent', {
                value: originalUA,
                writable: true,
                configurable: true
            });
        });
    });
});