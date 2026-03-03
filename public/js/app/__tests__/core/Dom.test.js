import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Dom from '../../core/Dom.js';

describe('Dom', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    describe('render', () => {
        it('should create single element', () => {
            const config = [
                { tag: 'div', selector: 'my-div', selectorAttr: 'id' }
            ];

            Dom.render(config, container);

            const div = container.querySelector('#my-div');
            expect(div).toBeTruthy();
            expect(div.tagName).toBe('DIV');
        });

        it('should add class to element', () => {
            const config = [
                { tag: 'div', selector: 'my-class', selectorAttr: 'class' }
            ];

            Dom.render(config, container);

            const div = container.querySelector('.my-class');
            expect(div).toBeTruthy();
        });

        it('should add multiple classes to element', () => {
            const config = [
                { tag: 'div', selector: ['btn', 'btn-primary', 'large'], selectorAttr: 'class' }
            ];

            Dom.render(config, container);

            const div = container.querySelector('div');
            expect(div.classList.contains('btn')).toBe(true);
            expect(div.classList.contains('btn-primary')).toBe(true);
            expect(div.classList.contains('large')).toBe(true);
        });

        it('should add custom attributes', () => {
            const config = [
                { tag: 'input', selector: 'email-input', selectorAttr: 'data-type' }
            ];

            Dom.render(config, container);

            const input = container.querySelector('input');
            expect(input.getAttribute('data-type')).toBe('email-input');
        });

        it('should add text node to element', () => {
            const config = [
                { tag: 'button', textNode: 'Click Me' }
            ];

            Dom.render(config, container);

            const button = container.querySelector('button');
            expect(button.textContent).toBe('Click Me');
        });

        it('should create nested elements', () => {
            const config = [
                {
                    tag: 'div',
                    selector: 'parent',
                    selectorAttr: 'id',
                    childNodes: [
                        { tag: 'span', textNode: 'Child 1' },
                        { tag: 'span', textNode: 'Child 2' }
                    ]
                }
            ];

            Dom.render(config, container);

            const parent = container.querySelector('#parent');
            const children = parent.querySelectorAll('span');
            expect(children.length).toBe(2);
            expect(children[0].textContent).toBe('Child 1');
            expect(children[1].textContent).toBe('Child 2');
        });

        it('should create deeply nested elements', () => {
            const config = [
                {
                    tag: 'div',
                    selector: 'level1',
                    selectorAttr: 'id',
                    childNodes: [
                        {
                            tag: 'div',
                            selector: 'level2',
                            selectorAttr: 'id',
                            childNodes: [
                                {
                                    tag: 'div',
                                    selector: 'level3',
                                    selectorAttr: 'id'
                                }
                            ]
                        }
                    ]
                }
            ];

            Dom.render(config, container);

            expect(container.querySelector('#level1')).toBeTruthy();
            expect(container.querySelector('#level1 #level2')).toBeTruthy();
            expect(container.querySelector('#level1 #level2 #level3')).toBeTruthy();
        });

        it('should render multiple root elements', () => {
            const config = [
                { tag: 'div', textNode: 'Element 1' },
                { tag: 'div', textNode: 'Element 2' },
                { tag: 'div', textNode: 'Element 3' }
            ];

            Dom.render(config, container);

            expect(container.querySelectorAll('div').length).toBe(3);
        });

        it('should append elements to parent', () => {
            const config = [
                { tag: 'p', textNode: 'Paragraph' }
            ];

            Dom.render(config, container);

            const p = container.querySelector('p');
            expect(p.parentElement).toBe(container);
        });

        it('should handle empty config', () => {
            Dom.render([], container);
            expect(container.children.length).toBe(0);
        });

        it('should not require selector', () => {
            const config = [
                { tag: 'div', textNode: 'No selector' }
            ];

            Dom.render(config, container);

            const div = container.querySelector('div');
            expect(div).toBeTruthy();
            expect(div.textContent).toBe('No selector');
        });

        it('should handle different HTML elements', () => {
            const config = [
                { tag: 'button', textNode: 'Click' },
                { tag: 'input' },
                { tag: 'form' },
                { tag: 'section' }
            ];

            Dom.render(config, container);

            expect(container.querySelector('button')).toBeTruthy();
            expect(container.querySelector('input')).toBeTruthy();
            expect(container.querySelector('form')).toBeTruthy();
            expect(container.querySelector('section')).toBeTruthy();
        });
    });

    describe('scrollToFinished', () => {
        it('should resolve promise when scroll position reached', async () => {
            const promise = Dom.scrollToFinished(100);

            // Simulate scroll
            window.scrollY = 100;
            await new Promise(resolve => setTimeout(resolve, 50));

            const result = await promise;
            expect(result).toBeUndefined();
        });

        it('should check window.scrollY', async () => {
            window.scrollY = 150;

            const promise = Dom.scrollToFinished(100);
            const result = await promise;

            expect(result).toBeUndefined();
        });

        it('should use requestAnimationFrame', async () => {
            const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

            window.scrollY = 0;
            const promise = Dom.scrollToFinished(100);

            // Let it run one iteration
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(rafSpy).toHaveBeenCalled();

            rafSpy.mockRestore();
        });

        it('should work with y=0', async () => {
            window.scrollY = 0;

            const promise = Dom.scrollToFinished(0);
            const result = await promise;

            expect(result).toBeUndefined();
        });

        it('should wait until scroll position is reached', async () => {
            window.scrollY = 0;

            const promise = Dom.scrollToFinished(50);

            // Change scroll position
            setTimeout(() => {
                window.scrollY = 50;
            }, 10);

            const result = await promise;
            expect(result).toBeUndefined();
        });

        it('should handle large scroll values', async () => {
            window.scrollY = 5000;

            const promise = Dom.scrollToFinished(4000);
            const result = await promise;

            expect(result).toBeUndefined();
        });
    });
});