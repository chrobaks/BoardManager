import { describe, it, expect, beforeEach } from 'vitest';
import EventBus from '../../core/EventBus.js';

describe('EventBus', () => {
    let eventBus;

    beforeEach(() => {
        eventBus = new EventBus();
    });

    it('should create an instance', () => {
        expect(eventBus).toBeDefined();
        expect(eventBus.events).toEqual({});
    });

    it('should register event handlers with on()', () => {
        const handler = () => {};
        eventBus.on('test-event', handler);

        expect(eventBus.events['test-event']).toBeDefined();
        expect(eventBus.events['test-event']).toContain(handler);
    });

    it('should emit events with payload', () => {
        let receivedPayload;
        eventBus.on('test-event', (payload) => {
            receivedPayload = payload;
        });

        eventBus.emit('test-event', { data: 'test' });

        expect(receivedPayload).toEqual({ data: 'test' });
    });

    it('should remove handlers with off()', () => {
        const handler = () => {};
        eventBus.on('test-event', handler);
        eventBus.off('test-event', handler);

        expect(eventBus.events['test-event']).not.toContain(handler);
    });

    it('should handle multiple handlers', () => {
        const results = [];
        const handler1 = () => results.push(1);
        const handler2 = () => results.push(2);

        eventBus.on('test-event', handler1);
        eventBus.on('test-event', handler2);
        eventBus.emit('test-event');

        expect(results).toEqual([1, 2]);
    });
});