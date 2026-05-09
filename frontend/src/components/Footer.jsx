import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <h3 className="font-bold text-white">Alumnex</h3>
            </div>
            <p className="text-sm text-gray-400">
              Real interview experiences from alumni. Learn, prepare, and succeed.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Browse Experiences
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-blue-400 transition">
                  Share Your Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition">
                  Twitter
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@alumnex.com" className="hover:text-blue-400 transition">
                  support@alumnex.com
                </a>
              </li>
              <li className="text-gray-500 text-xs mt-4">
                Made with ❤️ for students
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-500">
              © {currentYear} Alumnex. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-600 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-400 transition">Privacy</a>
              <a href="#" className="hover:text-gray-400 transition">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
