
import { describe, it, test, expect } from 'vitest';
import { page } from 'vitest/browser'


describe('Ui Test', () => {
    it('should detect list of button', async () => {
        const editButton = document.querySelectorAll('[data-event]');
        const submitButton = page.getByRole('button', { name: /Create new package/i });
    })
})
