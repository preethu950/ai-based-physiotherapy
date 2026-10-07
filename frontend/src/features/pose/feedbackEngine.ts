import { FeedbackItem } from './types';

export class FeedbackEngine {
    private activeFeedback: FeedbackItem[] = [];
    private lastShown: Map<string, number> = new Map();
    
    addFeedback(item: FeedbackItem): void {
        const now = item.timestamp;
        const lastTime = this.lastShown.get(item.code) || 0;
        
        if (now - lastTime > 3000) {
            this.activeFeedback.push(item);
            this.lastShown.set(item.code, now);
        }
    }
    
    getActiveFeedback(): FeedbackItem[] {
        this.activeFeedback.sort((a, b) => b.timestamp - a.timestamp);
        const result = this.activeFeedback.slice(0, 3);
        const now = Date.now();
        return result.filter(f => now - f.timestamp < 5000);
    }
    
    clear(): void {
        this.activeFeedback = [];
        this.lastShown.clear();
    }
}
