import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

function HomeFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-purple-600" />
              <span className="text-gray-900">DevPortal</span>
            </div>
            <p className="text-gray-600">Building the future of development tools.</p>
          </div>

          <div>
            <h4 className="text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900">Security</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">© 2026 DevPortal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
