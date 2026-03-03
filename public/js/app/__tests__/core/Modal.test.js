import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Modal from '../../core/Modal.js';

describe('Modal', () => {
    let modal;

    beforeEach(() => {
        // Clear any existing modals
        const existing = document.getElementById('gridModal');
        if (existing) {
            existing.remove();
        }
    });

    afterEach(() => {
        if (modal) {
            const modalEl = document.getElementById('gridModal');
            if (modalEl) {
                modalEl.remove();
            }
        }
    });

    it('should create modal instance', () => {
        modal = new Modal();
        expect(modal).toBeDefined();
        expect(modal.modal).toBeTruthy();
    });

    it('should render modal DOM', () => {
        modal = new Modal();
        const modalEl = document.getElementById('gridModal');
        expect(modalEl).toBeTruthy();
    });

    it('should have modal elements', () => {
        modal = new Modal();
        expect(modal.modalBg).toBeTruthy();
        expect(modal.modalContainer).toBeTruthy();
        expect(modal.modalHead).toBeTruthy();
        expect(modal.modalBody).toBeTruthy();
        expect(modal.modalFooter).toBeTruthy();
    });

    it('should initialize modal type as save', () => {
        modal = new Modal();
        expect(modal.modalType).toBe('save');
    });

    it('should setTitle on modal', () => {
        modal = new Modal();
        modal.setTitle('Test Title');
        expect(modal.modalHead.querySelector('.title').innerText).toBe('Test Title');
    });

    it('should truncate title if longer than 150 chars', () => {
        modal = new Modal();
        const longTitle = 'a'.repeat(200);
        modal.setTitle(longTitle);
        const displayedTitle = modal.modalHead.querySelector('.title').innerText;
        expect(displayedTitle.length).toBe(150);
    });

    it('should handle non-string title', () => {
        modal = new Modal();
        modal.setTitle(123);
        expect(modal.modalHead.querySelector('.title').innerText).toBe('');
    });

    it('should initialize events', () => {
        modal = new Modal();
        const closeBtn = modal.modal.querySelector('button.close');
        expect(closeBtn.onclick).toBeDefined();
    });

    it('should display and hide modal', () => {
        modal = new Modal();
        const initialDisplay = modal.modal.style.display;

        modal.display();
        expect(modal.modal.style.display).toBe('inline-block');

        modal.display();
        expect(modal.modal.style.display).toBe('none');
    });

    it('should add no-scroll class when displayed', () => {
        modal = new Modal();
        modal.display();
        expect(document.body.classList.contains('no-scroll')).toBe(true);
    });

    it('should remove no-scroll class when hidden', () => {
        modal = new Modal();
        modal.display(); // show
        modal.display(); // hide
        expect(document.body.classList.contains('no-scroll')).toBe(false);
    });

    it('should close modal', () => {
        modal = new Modal();
        modal.display(); // show
        modal.close();
        expect(modal.modal.style.display).toBe('none');
    });
});