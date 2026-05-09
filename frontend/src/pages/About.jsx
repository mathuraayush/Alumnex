import React from 'react'
import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

export default function About() {
  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-3xl shadow-lg">
            A
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            About Alumnex
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real interview experiences shared by alumni. Your guide to navigating the tech placement journey.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Alumnex is built on a simple belief: <strong>everyone deserves access to honest, real-world insights about job interviews</strong>. We connect students with authentic experiences shared by alumni who've already walked the path.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Instead of guessing what companies ask or how rounds work, you can learn directly from those who interviewed there. Every experience shared helps the next generation prepare smarter.
            </p>
          </div>
        </div>

        {/* Why Alumnex */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Why Alumnex?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-2xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Experiences</h3>
              <p className="text-gray-600">
                Verified interview stories from actual alumni. No fake reviews, no corporate fluff. Just honest insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-2xl mb-4">
                🔍
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Search</h3>
              <p className="text-gray-600">
                Filter by company, role, difficulty, and year. Find exactly the experiences relevant to you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 text-2xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Insights</h3>
              <p className="text-gray-600">
                See patterns across difficulty levels, companies, and years. Data-backed preparation.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">How to Use</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white font-bold text-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Browse & Search</h3>
                <p className="text-gray-600">
                  Search for companies you're interested in. Filter by role, difficulty level, and placement year to find relevant experiences.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white font-bold text-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Read Detailed Experiences</h3>
                <p className="text-gray-600">
                  Learn about the interview process, rounds, topics covered, and tips from those who've been through it.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white font-bold text-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Prepare Strategically</h3>
                <p className="text-gray-600">
                  Use these insights to strategically prepare for your interviews. Know what to expect, what to study, and how to approach it.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white font-bold text-lg">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Share Your Story</h3>
                <p className="text-gray-600">
                  After your interviews, share your experience to help the next batch of students. Simple upload process with CSV support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 md:p-12 text-white text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to Prepare Like a Pro?</h2>
          <p className="text-lg text-blue-100">
            Start exploring real interview experiences or share your own story with the community.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
            <Link
              to="/"
              className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
            >
              Browse Experiences
            </Link>
            <Link
              to="/admin/login"
              className="px-8 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition border border-white"
            >
              Share Your Experience
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center py-8">
          <p className="text-gray-600">
            Alumnex is powered by real Alumni. Made for Students. <br />
            <span className="text-sm text-gray-500">Helping you prepare. Supporting your success.</span>
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
