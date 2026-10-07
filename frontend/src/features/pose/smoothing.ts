export class AngleSmoother {
    private ema: Map<string, number> = new Map();
    
    smooth(name: string, rawValue: number, alpha: number = 0.4): number {
        if (!this.ema.has(name)) {
            this.ema.set(name, rawValue);
            return rawValue;
        }
        
        const currentEma = this.ema.get(name)!;
        const newEma = currentEma + alpha * (rawValue - currentEma);
        this.ema.set(name, newEma);
        return newEma;
    }
    
    reset(): void {
        this.ema.clear();
    }
}
