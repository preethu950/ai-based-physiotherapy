import { describe, it, expect, beforeEach } from 'vitest';
import { RepStateMachine } from '../repStateMachine';
import { squatConfig } from '../exercises/squat';

describe('RepStateMachine', () => {
    let machine: RepStateMachine;

    beforeEach(() => {
        machine = new RepStateMachine(squatConfig);
    });

    it('starts in READY phase', () => {
        const result = machine.update(180, new Map(), [], 0);
        expect(result.currentPhase).toBe('READY');
    });

    it('transitions to DESCENDING when angle drops below start threshold', () => {
        machine.update(180, new Map(), [], 0);
        const result = machine.update(150, new Map(), [], 100);
        expect(result.currentPhase).toBe('DESCENDING');
    });

    it('completes a full rep correctly', () => {
        const r1 = machine.update(180, new Map(), [], 0);
        const r2 = machine.update(150, new Map(), [], 200); // DESCENDING
        const r3 = machine.update(90, new Map(), [], 700); // BOTTOM
        const r4 = machine.update(110, new Map(), [], 950); // ASCENDING (> 100 + 5)
        const result = machine.update(170, new Map(), [], 1500); // READY
        console.log('TRACE PHASES:', { r1: r1.currentPhase, r2: r2.currentPhase, r3: r3.currentPhase, r4: r4.currentPhase, r5: result.currentPhase });
        
        expect(result.currentPhase).toBe('READY');
        expect(result.repCompleted).toBe(true);
        expect(result.repResult?.index).toBe(1);
    });

    it('rejects reps that are too fast', () => {
        machine.update(180, new Map(), [], 0);
        machine.update(150, new Map(), [], 100);
        machine.update(90, new Map(), [], 200);
        machine.update(105, new Map(), [], 300);
        const result = machine.update(170, new Map(), [], 400); // < 1000ms
        
        expect(result.currentPhase).toBe('READY');
        expect(result.repCompleted).toBe(false);
        expect(result.incompleteRep).toBe(true);
    });
});
