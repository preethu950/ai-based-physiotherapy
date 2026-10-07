import { describe, it, expect, beforeEach } from 'vitest';
import { FeedbackEngine } from '../feedbackEngine';

describe('FeedbackEngine', () => {
    let engine: FeedbackEngine;

    beforeEach(() => {
        engine = new FeedbackEngine();
    });

    it('adds feedback and debounces same code', () => {
        const now = Date.now();
        engine.addFeedback({ code: 'test', severity: 'warning', text: 'Test', timestamp: now });
        engine.addFeedback({ code: 'test', severity: 'warning', text: 'Test', timestamp: now + 1000 });
        
        const active = engine.getActiveFeedback();
        expect(active.length).toBe(1);
    });

    it('allows different codes', () => {
        const now = Date.now();
        engine.addFeedback({ code: 'test1', severity: 'warning', text: 'Test 1', timestamp: now });
        engine.addFeedback({ code: 'test2', severity: 'warning', text: 'Test 2', timestamp: now + 1000 });
        
        const active = engine.getActiveFeedback();
        expect(active.length).toBe(2);
    });
});
