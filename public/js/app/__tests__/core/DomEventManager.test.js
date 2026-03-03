import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import DomEventManager from '../../core/DomEventManager.js';
import EventBus from '../../core/EventBus.js';

describe('DomEventManager', () => {
    let rootElement;
    let eventBus;
    let domEventManager;

    beforeEach(() => {
        // Create a mock DOM element
        rootElement = document.createElement('div');
        document.body.appendChild(rootElement);

        // Create EventBus instance
        eventBus = new EventBus();

        // Spy on eventBus.emit to track calls
        vi.spyOn(eventBus, 'emit');
    });

    afterEach(() => {
        // Clean up
        if (domEventManager) {
            domEventManager.destroy();
        }
        document.body.removeChild(rootElement);
        vi.restoreAllMocks();
    });

    it('should create an instance with default events', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        expect(domEventManager).toBeDefined();
        expect(domEventManager.root).toBe(rootElement);
        expect(domEventManager.eventBus).toBe(eventBus);
        expect(domEventManager.defaultEvents).toEqual([
            'click', 'input', 'change', 'submit', 'keyup', 'contextmenu'
        ]);
    });

    it('should initialize with default supported events', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        expect(domEventManager.supportedEvents).toContain('click');
        expect(domEventManager.supportedEvents).toContain('input');
        expect(domEventManager.supportedEvents).toContain('change');
    });

    it('should add additional events when provided', () => {
        domEventManager = new DomEventManager(rootElement, eventBus, {
            additionalEvents: ['focus', 'blur']
        });

        expect(domEventManager.supportedEvents).toContain('focus');
        expect(domEventManager.supportedEvents).toContain('blur');
        expect(domEventManager.supportedEvents).toContain('click'); // default still there
    });

    it('should override events when override option is true', () => {
        domEventManager = new DomEventManager(rootElement, eventBus, {
            override: true,
            events: ['click', 'focus']
        });

        expect(domEventManager.supportedEvents).toEqual(['click', 'focus']);
        expect(domEventManager.supportedEvents).not.toContain('input');
    });

    it('should emit event when element with data-event is clicked', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        // Create a button with data-event attribute
        const button = document.createElement('button');
        button.setAttribute('data-event', 'myAction');
        button.setAttribute('data-custom', 'customValue');
        rootElement.appendChild(button);

        // Simulate click
        button.click();

        // Check if eventBus.emit was called
        expect(eventBus.emit).toHaveBeenCalledWith(
            'click:myAction',
            expect.objectContaining({
                event: 'myAction',
                custom: 'customValue',
                id: undefined,
                targetValue: null
            })
        );
    });

    it('should extract item-id from closest parent', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        // Create nested structure
        const container = document.createElement('div');
        container.setAttribute('data-item-id', '123');
        const button = document.createElement('button');
        button.setAttribute('data-event', 'deleteItem');
        container.appendChild(button);
        rootElement.appendChild(container);

        // Simulate click
        button.click();

        expect(eventBus.emit).toHaveBeenCalledWith(
            'click:deleteItem',
            expect.objectContaining({
                id: '123'
            })
        );
    });

    it('should capture input value from target element', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        // Create input field
        const input = document.createElement('input');
        input.setAttribute('data-event', 'searchInput');
        input.value = 'test search';
        rootElement.appendChild(input);

        // Simulate input event
        input.dispatchEvent(new Event('input', { bubbles: true }));

        expect(eventBus.emit).toHaveBeenCalledWith(
            'input:searchInput',
            expect.objectContaining({
                targetValue: 'test search'
            })
        );
    });

    it('should use data-value attribute if input has no value', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        const element = document.createElement('div');
        element.setAttribute('data-event', 'customAction');
        element.setAttribute('data-value', 'customData');
        rootElement.appendChild(element);

        // Simulate click
        element.click();

        expect(eventBus.emit).toHaveBeenCalledWith(
            'click:customAction',
            expect.objectContaining({
                targetValue: 'customData'
            })
        );
    });

    it('should not emit event if target does not have data-event attribute', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        const button = document.createElement('button');
        button.textContent = 'Click me';
        rootElement.appendChild(button);

        // Simulate click
        button.click();

        // eventBus.emit should not be called
        expect(eventBus.emit).not.toHaveBeenCalled();
    });

    it('should include originalEvent and targetElement in emitted data', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        const button = document.createElement('button');
        button.setAttribute('data-event', 'testAction');
        rootElement.appendChild(button);

        button.click();

        const callArgs = eventBus.emit.mock.calls[0][1];
        expect(callArgs.originalEvent).toBeDefined();
        expect(callArgs.targetElement).toBe(button);
    });

    it('should initialize supported events array', () => {
        domEventManager = new DomEventManager(rootElement, eventBus, {
            override: true,
            events: ['click', 'input', 'change']
        });

        // Verify supportedEvents is properly initialized
        expect(domEventManager.supportedEvents).toBeDefined();
        expect(Array.isArray(domEventManager.supportedEvents)).toBe(true);
        expect(domEventManager.supportedEvents.length).toBeGreaterThan(0);
    });

    it('should call addDesktopHoverEvents during initialization', () => {
        const spy = vi.spyOn(DomEventManager.prototype, 'addDesktopHoverEvents');

        domEventManager = new DomEventManager(rootElement, eventBus);

        expect(spy).toHaveBeenCalled();

        spy.mockRestore();
    });

    it('should have addDesktopHoverEvents method', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        expect(typeof domEventManager.addDesktopHoverEvents).toBe('function');
    });

    it('should handle multiple data attributes correctly', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        const button = document.createElement('button');
        button.setAttribute('data-event', 'updateItem');
        button.setAttribute('data-id', '456');
        button.setAttribute('data-type', 'category');
        button.setAttribute('data-priority', 'high');
        rootElement.appendChild(button);

        button.click();

        const callArgs = eventBus.emit.mock.calls[0][1];
        expect(callArgs.type).toBe('category');
        expect(callArgs.priority).toBe('high');
    });

    it('should handle events with different event types', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        const input = document.createElement('input');
        input.setAttribute('data-event', 'searchQuery');
        input.value = 'test';
        rootElement.appendChild(input);

        // Test input event
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(eventBus.emit).toHaveBeenCalledWith(
            'input:searchQuery',
            expect.any(Object)
        );

        // Test change event
        eventBus.emit.mockClear();
        input.dispatchEvent(new Event('change', { bubbles: true }));
        expect(eventBus.emit).toHaveBeenCalledWith(
            'change:searchQuery',
            expect.any(Object)
        );
    });

    it('should handle events bubbling from nested elements', () => {
        domEventManager = new DomEventManager(rootElement, eventBus);

        const parent = document.createElement('div');
        const child = document.createElement('span');
        child.setAttribute('data-event', 'nestedClick');
        parent.appendChild(child);
        rootElement.appendChild(parent);

        child.click();

        expect(eventBus.emit).toHaveBeenCalledWith(
            'click:nestedClick',
            expect.any(Object)
        );
    });
});