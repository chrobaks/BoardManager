import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ModalAdapter from '../../core/ModalAdapter.js';

describe('ModalAdapter', () => {
    let adapter;

    beforeEach(() => {
        const existing = document.getElementById('gridModal');
        if (existing) {
            existing.remove();
        }
    });

    afterEach(() => {
        if (adapter) {
            const modalEl = document.getElementById('gridModal');
            if (modalEl) {
                modalEl.remove();
            }
        }
    });

    it('should create adapter instance', () => {
        adapter = new ModalAdapter();
        expect(adapter).toBeDefined();
        expect(adapter.modal).toBeDefined();
    });

    it('should delegate setTitle to modal', () => {
        adapter = new ModalAdapter();
        const spy = vi.spyOn(adapter.modal, 'setTitle');

        adapter.setTitle('Test Title');
        expect(spy).toHaveBeenCalledWith('Test Title');
    });

    it('should set title on modal', () => {
        adapter = new ModalAdapter();
        adapter.setTitle('My Title');
        const title = adapter.modal.modalHead.querySelector('.title').innerText;
        expect(title).toBe('My Title');
    });

    it('should set content on modal', () => {
        adapter = new ModalAdapter();
        // Mock renderBody since it might not exist
        adapter.modal.renderBody = vi.fn();

        adapter.setContent('<p>Test Content</p>');
        expect(adapter.modal.renderBody).toHaveBeenCalled();
    });

    it('should set modal type', () => {
        adapter = new ModalAdapter();
        adapter.modal.renderButtons = vi.fn();

        adapter.setContent('<p>Test</p>', { type: 'prompt' });
        expect(adapter.modal.modalType).toBe('prompt');
    });

    it('should call renderButtons when type provided', () => {
        adapter = new ModalAdapter();
        const spy = vi.spyOn(adapter.modal, 'renderButtons');
        adapter.modal.renderBody = vi.fn();

        adapter.setContent('<p>Test</p>', { type: 'save' });
        expect(spy).toHaveBeenCalled();
    });

    it('should close modal', () => {
        adapter = new ModalAdapter();
        const spy = vi.spyOn(adapter.modal, 'display');

        adapter.close();
        expect(spy).toHaveBeenCalled();
    });

    it('should get modal form element', () => {
        adapter = new ModalAdapter();
        // Create a form in modal body
        const form = document.createElement('form');
        adapter.modal.modalBody.appendChild(form);

        const result = adapter.getModalForm();
        expect(result).toBe(form);
    });

    it('should return modal body if no form exists', () => {
        adapter = new ModalAdapter();
        const result = adapter.getModalForm();
        expect(result).toBe(adapter.modal.modalBody);
    });
});