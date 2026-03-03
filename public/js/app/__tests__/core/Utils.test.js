import { describe, it, expect } from 'vitest';
import Utils from '../../core/Utils.js';

describe('Utils', () => {
    describe('collectionLength', () => {
        it('should return length of array', () => {
            const arr = [1, 2, 3, 4, 5];
            expect(Utils.collectionLength(arr)).toBe(5);
        });

        it('should return 0 for empty array', () => {
            expect(Utils.collectionLength([])).toBe(0);
        });

        it('should return size of Map', () => {
            const map = new Map();
            map.set('key1', 'value1');
            map.set('key2', 'value2');
            expect(Utils.collectionLength(map)).toBe(2);
        });

        it('should return size of Set', () => {
            const set = new Set([1, 2, 3, 3]); // Set removes duplicates
            expect(Utils.collectionLength(set)).toBe(3);
        });

        it('should return number of keys in object', () => {
            const obj = { a: 1, b: 2, c: 3 };
            expect(Utils.collectionLength(obj)).toBe(3);
        });

        it('should return 0 for empty object', () => {
            expect(Utils.collectionLength({})).toBe(0);
        });

        it('should return 0 for null or undefined', () => {
            expect(Utils.collectionLength(null)).toBe(0);
            expect(Utils.collectionLength(undefined)).toBe(0);
        });

        it('should return 0 for primitive types', () => {
            expect(Utils.collectionLength('string')).toBe(0);
            expect(Utils.collectionLength(123)).toBe(0);
            expect(Utils.collectionLength(true)).toBe(0);
        });
    });

    describe('indexByKey', () => {
        it('should find index by key in array', () => {
            const arr = [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' },
                { id: 3, name: 'Charlie' }
            ];
            expect(Utils.indexByKey(arr, 'id', 2)).toBe(1);
        });

        it('should return -1 if key value not found in array', () => {
            const arr = [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' }
            ];
            expect(Utils.indexByKey(arr, 'id', 999)).toBe(-1);
        });

        it('should return -1 for empty array', () => {
            expect(Utils.indexByKey([], 'id', 1)).toBe(-1);
        });

        it('should find index in Map by key value', () => {
            const map = new Map();
            map.set('key1', { id: 1, name: 'Alice' });
            map.set('key2', { id: 2, name: 'Bob' });
            expect(Utils.indexByKey(map, 'id', 2)).toBe(1);
        });

        it('should return -1 for Map with no matching value', () => {
            const map = new Map();
            map.set('key1', { id: 1, name: 'Alice' });
            expect(Utils.indexByKey(map, 'id', 999)).toBe(-1);
        });

        it('should return -1 for object (not array or Map)', () => {
            const obj = { id: 1, name: 'Alice' };
            expect(Utils.indexByKey(obj, 'id', 1)).toBe(-1);
        });

        it('should handle objects with optional chaining', () => {
            const arr = [
                { user: { id: 1 } },
                { user: { id: 2 } }
            ];
            expect(Utils.indexByKey(arr, 'user', { id: 2 })).toBe(-1); // object comparison won't work
        });

        it('should skip null values in array search', () => {
            const arr = [
                { id: 1 },
                null,
                { id: 2 }
            ];
            expect(Utils.indexByKey(arr, 'id', 1)).toBe(0);
        });
    });

    describe('firstCharUpperCase', () => {
        it('should uppercase first character of string', () => {
            expect(Utils.firstCharUpperCase('hello')).toBe('Hello');
        });

        it('should convert rest to lowercase by default', () => {
            expect(Utils.firstCharUpperCase('hELLO')).toBe('Hello');
        });

        it('should preserve case of rest when formateToLowerCase is false', () => {
            expect(Utils.firstCharUpperCase('hELLO', false)).toBe('HELLO');
        });

        it('should handle single character', () => {
            expect(Utils.firstCharUpperCase('a')).toBe('A');
            expect(Utils.firstCharUpperCase('A')).toBe('A');
        });

        it('should handle empty string', () => {
            expect(Utils.firstCharUpperCase('')).toBe('');
        });

        it('should handle whitespace only string', () => {
            expect(Utils.firstCharUpperCase('   ')).toBe('');
        });

        it('should trim whitespace', () => {
            expect(Utils.firstCharUpperCase('  hello world')).toBe('Hello world');
            expect(Utils.firstCharUpperCase('hello world  ')).toBe('Hello world');
        });

        it('should handle non-string input', () => {
            expect(Utils.firstCharUpperCase(null)).toBe('');
            expect(Utils.firstCharUpperCase(undefined)).toBe('');
            expect(Utils.firstCharUpperCase(123)).toBe('');
            expect(Utils.firstCharUpperCase(true)).toBe('');
        });

        it('should handle special characters', () => {
            expect(Utils.firstCharUpperCase('!hello')).toBe('!hello');
            expect(Utils.firstCharUpperCase('123hello')).toBe('123hello');
        });
    });
});