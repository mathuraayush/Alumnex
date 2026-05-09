import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Toast from './components/Toast'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

const Home = lazy(() => import('./pages/Home'))
const CompanyDetail = lazy(() => import('./pages/CompanyDetail'))
const ThreadDetail = lazy(() => import('./pages/ThreadDetail'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const CreateThread = lazy(() => import('./pages/CreateThread'))
const BulkUpload = lazy(() => import('./pages/BulkUpload'))

export default function AppRoutes() {
  return (
    <>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/company/:slug" element={<CompanyDetail />} />
          <Route path="/thread/:id" element={<ThreadDetail />} />
          <Route path="/search" element={<SearchResults />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          
          <Route
            path="/admin/thread/create"
            element={
              <ProtectedAdminRoute>
                <CreateThread />
              </ProtectedAdminRoute>
            }
          />
          
          <Route
            path="/admin/bulk-upload"
            element={
              <ProtectedAdminRoute>
                <BulkUpload />
              </ProtectedAdminRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toast />
    </>
  )
}
