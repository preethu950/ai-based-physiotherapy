import { ExerciseConfig, Landmark, RepPhase, RepResult, ComponentScores } from './types';
import { evaluateROM, evaluateTempo, evaluateCompletion, calculateRepScore } from './formEvaluator';

export interface RepUpdate {
    repCompleted: boolean;
    repResult?: RepResult;
    currentPhase: RepPhase;
    incompleteRep?: boolean;
}

export class RepStateMachine {
    private config: ExerciseConfig;
    private phase: RepPhase = 'READY';
    private repCount: number = 0;
    
    private lastPhaseChangeMs: number = 0;
    private repStartMs: number = 0;
    
    private minAngle: number = 180;
    private maxAngle: number = 0;
    
    private totalReps: number = 0;
    private correctReps: number = 0;
    private needsImprovementReps: number = 0;
    private incompleteReps: number = 0;
    
    constructor(config: ExerciseConfig) {
        this.config = config;
    }
    
    update(primaryAngle: number, allAngles: Map<string, number>, landmarks: Landmark[], timestamp: number): RepUpdate {
        let repCompleted = false;
        let incompleteRep = false;
        let repResult: RepResult | undefined = undefined;
        
        const hysteresis = this.config.hysteresisDeg;
        
        if (this.phase !== 'READY') {
            this.minAngle = Math.min(this.minAngle, primaryAngle);
            this.maxAngle = Math.max(this.maxAngle, primaryAngle);
        }
        
        const phaseDuration = timestamp - this.lastPhaseChangeMs;
        const canChangePhase = phaseDuration >= this.config.minPhaseMs;
        
        const isDecreasing = this.config.phases.target.max < this.config.phases.start.min;
        
        const crossedTarget = isDecreasing 
            ? primaryAngle <= this.config.phases.target.max 
            : primaryAngle >= this.config.phases.target.min;
            
        const crossedTargetHysteresis = isDecreasing
            ? primaryAngle > this.config.phases.target.max + hysteresis
            : primaryAngle < this.config.phases.target.min - hysteresis;
            
        const crossedStart = isDecreasing
            ? primaryAngle >= this.config.phases.start.min
            : primaryAngle <= this.config.phases.start.max;
            
        const crossedStartHysteresis = isDecreasing
            ? primaryAngle < this.config.phases.start.min - hysteresis
            : primaryAngle > this.config.phases.start.max + hysteresis;

        let newPhase = this.phase;

        switch (this.phase) {
            case 'READY':
                if (crossedStartHysteresis) {
                    newPhase = 'DESCENDING';
                    this.repStartMs = timestamp;
                    this.minAngle = primaryAngle;
                    this.maxAngle = primaryAngle;
                }
                break;
            case 'DESCENDING':
                if (crossedTarget && canChangePhase) {
                    newPhase = 'BOTTOM';
                } else if (crossedStart && canChangePhase) {
                    newPhase = 'READY';
                    incompleteRep = true;
                    this.incompleteReps++;
                }
                break;
            case 'BOTTOM':
                if (crossedTargetHysteresis && canChangePhase) {
                    newPhase = 'ASCENDING';
                }
                break;
            case 'ASCENDING':
                if (crossedStart && canChangePhase) {
                    const repDuration = timestamp - this.repStartMs;
                    if (repDuration >= this.config.minRepMs) {
                        newPhase = 'READY';
                        repCompleted = true;
                        
                        const startAng = isDecreasing ? this.maxAngle : this.minAngle;
                        const reachedAng = isDecreasing ? this.minAngle : this.maxAngle;
                        const targetAng = (this.config.phases.target.min + this.config.phases.target.max) / 2;
                        
                        const romScore = evaluateROM(startAng, reachedAng, targetAng, this.config);
                        const tempoScore = evaluateTempo(repDuration, { down: this.config.tempo.downMs[0], up: this.config.tempo.upMs[0] }, this.config);
                        const completionScore = evaluateCompletion(true, true);
                        
                        const issues: string[] = [];
                        let alignmentScore = 100;
                        let stabilityScore = 100;
                        
                        for (const check of this.config.formChecks) {
                            const checkResult = check.evaluate(landmarks, allAngles, this.config);
                            if (checkResult.score < 100) {
                                alignmentScore = Math.min(alignmentScore, checkResult.score);
                                if (checkResult.feedback) issues.push(checkResult.feedback.text);
                            }
                        }
                        
                        const componentScores: ComponentScores = {
                            alignment: alignmentScore,
                            rom: romScore,
                            stability: stabilityScore,
                            tempo: tempoScore,
                            completion: completionScore
                        };
                        
                        const score = calculateRepScore(componentScores, this.config.weights);
                        
                        this.repCount++;
                        this.totalReps++;
                        if (score >= this.config.correctRepMinScore) {
                            this.correctReps++;
                        } else {
                            this.needsImprovementReps++;
                        }
                        
                        repResult = {
                            index: this.repCount,
                            score,
                            durationMs: repDuration,
                            minAngle: this.minAngle,
                            maxAngle: this.maxAngle,
                            componentScores,
                            issues,
                            phase: 'complete'
                        };
                    } else {
                        newPhase = 'READY';
                        incompleteRep = true;
                        this.incompleteReps++;
                    }
                } else if (crossedTarget && canChangePhase) {
                    newPhase = 'BOTTOM';
                }
                break;
        }

        if (newPhase !== this.phase) {
            this.phase = newPhase;
            this.lastPhaseChangeMs = timestamp;
        }

        return { repCompleted, repResult, currentPhase: this.phase, incompleteRep };
    }
    
    reset(): void {
        this.phase = 'READY';
        this.repCount = 0;
        this.lastPhaseChangeMs = 0;
        this.repStartMs = 0;
        this.minAngle = 180;
        this.maxAngle = 0;
        this.totalReps = 0;
        this.correctReps = 0;
        this.needsImprovementReps = 0;
        this.incompleteReps = 0;
    }
    
    getStats(): { total: number; correct: number; needsImprovement: number; incomplete: number; } {
        return { total: this.totalReps, correct: this.correctReps, needsImprovement: this.needsImprovementReps, incomplete: this.incompleteReps };
    }
}
