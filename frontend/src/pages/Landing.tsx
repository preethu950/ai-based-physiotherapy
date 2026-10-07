import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Video, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface flex flex-col overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue/10 rounded-full blur-[120px]" />
      </div>

      <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-surface-alt sticky top-0 z-50">
        <div className="flex items-center gap-2 text-navy font-bold text-xl transition-transform hover:scale-105 cursor-default">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-navy flex items-center justify-center shadow-lg shadow-teal/20">
            <Activity size={18} className="text-white" />
          </div>
          Physio<span className="text-teal">AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 font-medium text-navy hover:text-teal transition-colors">Log In</Link>
          <Link to="/register" className="px-4 py-2 font-medium text-white bg-navy rounded-xl hover:bg-navy-light transition-transform hover:-translate-y-0.5 shadow-md">Sign Up</Link>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="py-24 px-6 max-w-6xl mx-auto text-center stat-card-anim">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal/10 text-teal font-medium text-sm mb-8 border border-teal/20 float-anim">
            <Sparkles size={14} />
            <span>AI-Powered Physiotherapy</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-navy mb-6 tracking-tight leading-tight">
            Move better. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-blue">Recover smarter.</span>
          </h1>
          <p className="text-xl text-navy-light mb-10 max-w-2xl mx-auto leading-relaxed">
            Your personal AI physiotherapy assistant. Get real-time feedback on your exercise form and track your rehabilitation progress from anywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal to-teal-dark text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-teal/30 transition-all hover:-translate-y-1">
              Start Free Trial
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/exercises" className="px-8 py-4 bg-white text-navy border-2 border-surface-alt rounded-xl font-bold text-lg hover:border-teal/30 hover:bg-surface transition-all hover:-translate-y-1">
              Explore Exercises
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 bg-white/50 backdrop-blur-sm border-y border-surface-alt px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Everything you need to recover</h2>
              <p className="text-navy-light max-w-2xl mx-auto text-lg">Comprehensive tools designed to guide you through a safe and effective rehabilitation journey.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Video, title: 'AI Analysis', desc: 'Real-time computer vision analyzes your pose with pinpoint accuracy.' },
                { icon: Activity, title: 'Rep Tracking', desc: 'Automatically tracks correct reps, tempo, and range of motion.' },
                { icon: CheckCircle2, title: 'Form Scoring', desc: 'Get a comprehensive 0-100 score for every session with targeted feedback.' },
                { icon: TrendingUp, title: 'Progress Insights', desc: 'Visualize your recovery journey with detailed charts and actionable metrics.' },
                { icon: Shield, title: 'Privacy-First', desc: 'All processing happens locally on your device. Zero video data ever leaves.' },
                { icon: Sparkles, title: 'Expert Exercises', desc: 'Curated library of evidence-based physiotherapy movements and stretches.' }
              ].map((f, i) => (
                <div key={i} className="group p-8 bg-white rounded-3xl border border-surface-alt shadow-sm hover:shadow-xl hover:shadow-teal/5 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center text-teal mb-6 group-hover:scale-110 group-hover:bg-teal/10 transition-transform duration-300">
                    <f.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-3">{f.title}</h3>
                  <p className="text-navy-light leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <DisclaimerBanner />
        </section>
      </main>

      <footer className="bg-navy text-white py-12 px-6 relative z-10 border-t border-navy-light">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
             <div className="w-6 h-6 rounded bg-teal flex items-center justify-center">
              <Activity size={14} className="text-navy" />
            </div>
            PhysioAI
          </div>
          <div className="flex gap-6 text-sm text-navy-light">
            <Link to="#" className="hover:text-teal transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-teal transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-teal transition-colors">Contact</Link>
          </div>
          <p className="text-navy-light text-sm">© {new Date().getFullYear()} PhysioAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
