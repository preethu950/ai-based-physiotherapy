import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const Assistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! Based on your recent Squat sessions, I noticed your knee alignment is improving, but depth could be better. How can I help you today?' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');

    // Rule-based dummy response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'That is a great question. For better squat depth, try warming up your ankles and hips before the session. Want me to suggest some stretches?' 
      }]);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] py-4 md:py-8 flex flex-col px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-navy mb-2">AI Assistant</h1>
        <p className="text-navy-light">Get personalized advice based on your form data.</p>
      </div>

      <div className="bg-gradient-to-r from-teal/10 to-blue/10 border border-teal/20 rounded-2xl p-4 mb-6 flex gap-4 items-start">
        <div className="p-2 bg-white rounded-full text-teal shrink-0">
          <Sparkles size={24} />
        </div>
        <div>
          <h4 className="font-bold text-navy mb-1">Insight of the Day</h4>
          <p className="text-sm text-navy-dark">Your stability score drops during the last 3 reps of your sets. Focus on core engagement when you start feeling fatigued.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-t-2xl border border-surface-alt shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-teal text-white' : 'bg-surface-alt text-navy'
              }`}>
                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className={`max-w-[75%] rounded-2xl p-4 ${
                msg.role === 'assistant' ? 'bg-surface text-navy-dark rounded-tl-none' : 'bg-navy text-white rounded-tr-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-surface border-t border-surface-alt">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your form, exercises, or recovery..." 
              className="w-full bg-white border border-surface-alt rounded-full pl-6 pr-14 py-3 outline-none focus:ring-2 focus:ring-teal shadow-sm"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal text-white rounded-full hover:bg-teal-dark disabled:opacity-50 disabled:hover:bg-teal transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4">
        <DisclaimerBanner variant="compact" />
      </div>
    </div>
  );
};
