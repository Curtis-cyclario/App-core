import React from 'react';
import { Link } from 'wouter';
import { BookOpen, FileText, Users, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">VertiGro IoT</h3>
            <p className="text-slate-400 text-sm">
              Revolutionizing agriculture with intelligent IoT solutions for sustainable farming.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <span className="sr-only">Support</span>
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/network" className="text-slate-400 hover:text-white transition-colors">Network</Link></li>
              <li><Link href="/analytics" className="text-slate-400 hover:text-white transition-colors">Analytics</Link></li>
              <li><Link href="/ai-diagnostics" className="text-slate-400 hover:text-white transition-colors">AI Diagnostics</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-medium mb-4 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/resources" className="text-slate-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/resources" className="text-slate-400 hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/resources" className="text-slate-400 hover:text-white transition-colors">Guides & Tutorials</Link></li>
              <li><Link href="/resources" className="text-slate-400 hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Status Page</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-700">
          <p className="text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} VertiGro IoT by Cyclerio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
