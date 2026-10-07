export class LocalRuleBasedAssistant {
  static getSummary(sessions: any[]) {
    if (!sessions || sessions.length === 0) return 'No sessions yet. Start exercising to get insights!';
    const avgScore = sessions.reduce((sum, s) => sum + s.formScore, 0) / sessions.length;
    if (avgScore > 85) return 'Great job! Your form is consistently excellent.';
    if (avgScore > 70) return 'Good progress, but there is room for improvement in your form.';
    return 'Focus on your form. Try watching the demo videos again or consult a professional.';
  }

  static answerQuestion(question: string, sessions: any[]) {
    const q = question.toLowerCase();
    
    if (q.includes('injury') || q.includes('pain') || q.includes('hurt') || q.includes('diagnose')) {
      return "I cannot provide medical advice or diagnoses. If you are experiencing pain or suspect an injury, please consult a healthcare professional.";
    }

    if (q.includes('score') || q.includes('progress')) {
      return `Your average form score is ${sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.formScore, 0) / sessions.length) : 0}. Keep it up!`;
    }

    return "I am a simple rule-based assistant. I can answer basic questions about your progress or scores.";
  }
}
